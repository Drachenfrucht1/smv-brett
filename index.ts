//IMPORTS
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const url = require("url");
const fs = require("fs");
var createClient = require("webdav");

var enigma = require("./crypto.js");
var files: Array<file> = require("./files.json");
var config = require("./config.json");

//VARIABLES
let win;

//create a webdav client
var client = createClient(
    config.url,
    config.username,
    enigma.decrypt(config.pwH, config.key)
);

//create subdirectory for downloaded files
if(!fs.existsSync("./files")) {
    fs.mkdirSync("./files");
}

//run the check every 'check' minutes
setInterval(checkFiles, config.check * 1000 * 60);

//open a window when app is ready
app.on("ready", createWindow);
/*app.on("windows-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});*/

/**
 * FUNCTION: createWindow()
 * PURPOSE: creates a new window for the smv-brett
 */
function createWindow() {
    win = new BrowserWindow({width: config.widht, height: config.height/*, frame: false*/});

    win.loadURL(url.format({
        pathname: path.join(__dirname, "/public/index.html"),
        protocol:"file",
        slashes: true
    }));

    win.webContents.openDevTools();

    win.on("closed", () => {
        win = null;
    });
}

/**
 * FUNCTION: checkFiles()
 * PURPOSE: make all kinds of checks with local and remote files
 */
function checkFiles(): void {
    //get list with all remote files
    client.getDirectoryContents("/smv-brett").then(contents => {
        if (contents.length <= 1) {
            console.log("No file in smv-brett directory");
        } else {
            //check if file is localy but not remotely
            checkForDelete(contents);
            //download missing files
            downloadMissingFiles(contents);
        }
    });
}

/**
 * FUNCTION: checkForDelete()
 * PURPOSE: check for local files which have to get deleted
 * 
 * @param contents list with all remote files
 */
function checkForDelete(contents: Array<file>): void {
    let files_2 = files;
    let finished: number = 0;
    let removing: number = 0;
    //check every local file with every remote file
    for (let i = 0; i < files.length; i++) {
        let exists = false;
        for (let a = 0; a < contents.length; a++) {
            if (files[i].basename == contents[a].basename) {
                exists = true;
            }
        }
        if (!exists) {
            removing++;
            //delete file
            fs.unlinkSync("./files/" + files[i].basename);
            deleteFromArray(files_2, files[i]);

            finished++;
        }
    }
    let b;
    while(finished < removing) {
        b = 1; //do something while waiting (otherwise the while loop will get skiped)
    }
    files = files_2;
}

/**
 * FUNCTION: downloadMissingFiles()
 * PURPOSE: download remote files which are missing localy
 * 
 * @param contents list with all remote files
 */
function downloadMissingFiles(contents: Array<file>): void {
    for (let i = 1; i < contents.length; i++) {
        if (!fileExists(contents[i].filename)) {
            console.log("Downloading " + contents[i].basename);
            downloadFile(contents[i]);
        } else if (fileEdited(contents[i])) {
            console.log("Downloading " + contents[i].basename);
            downloadFile(contents[i]);
        }
    }
    fs.writeFile("./files.json", JSON.stringify(files));
}

/**
 * FUNCTION: fileExists()
 * PURPOSE: check if a file is available localy
 * 
 * @param name name of the file
 */
function fileExists(name: string) {
    for (let i = 0; i < files.length; i++) {
        if (name == files[i].filename) return files[i];
    }
    return undefined;
}

/**
 * FUNCTION: fileEdited()
 * PURPOSE: check if a remote file has a newer version than the local one
 * 
 * @param file remote file object
 * @returns bool if edited
 */
function fileEdited(file: file): boolean {
    let localFile = fileExists(file.filename);
    let remoteChange = Date.parse(file.lastmod);
    let localChange = Date.parse(localFile.lastmod);
    if (localChange < remoteChange) {
        return true;
    } else {
        return false;
    }
}

/**
 * FUNCTION: downloadFile()
 * PURPOSE: downloads a file from the remote
 * 
 * @param file file to be downloaded
 */
function downloadFile(file): void {
    try {
        client.getFileContents("/smv-brett/" + file.basename).then(data => {
            fs.writeFileSync("./files/" + file.basename, data);
            deleteFromArray(files,file);
            files.push(file);

            console.log("Finished download");
        });
    } catch (err) {
        throw err;
    }
}

/**
 * FUNCTION: deleteFromArray()
 * PURPOSE: delete one item from an array
 * 
 * @returns the new array
 */
function deleteFromArray(array: Array<file>, a: file): void {
    console.log(array);
    let index = array.position(a);
    if(index > -1) {
        array.splice(index, 1);
    }
    console.log(array);
}

interface Array<T> {
    contains(a: T): boolean;
    position(a: T): number;
}

/**
 * FUNCTION: Array.contains()
 * PURPOSE: hard-coded function to check if a file object is in the array (I know it's not good practise to hard-code such things)
 */
Array.prototype.contains = function(a): boolean {
    for(let i = 0; i < this.length; i++) {
        if(this[i].filename == a.filename) {
            return true;
        }
    }
    return false;
}

/**
 * FUNCTION: Array.position()
 * PURPOSE: hard-coded function to get the position of a file object in the array (I know it's not good practise to hard-code such things)
 */
Array.prototype.position = function(a: file): number {
    if(this.contains(a)) {
        for (let i = 0; i < this.length; i++) {
            if (this[i].filename == a.filename) {
                return i;
            }
        }
    } else {
        return -1;
    }
}

/**
 * Data class for file object
 */
class file {
    filename: string;
    basename: string;
    lastmod: string;
    size: number;
    type: string;
}