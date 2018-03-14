//IMPORTS
const electron = require("electron");
var {ipcRenderer, remote} = electron;
const fs = require("fs");

const config = require("../config.json");

var index = 0;

let files; //array with all files

var timer; // id of the scheduler

//imageview in which the images get presented
let imgView: HTMLImageElement = <HTMLImageElement>document.getElementById("img");

//correct size of imageview
const {width, height} = electron.screen.getPrimaryDisplay().workAreaSize;
imgView.style.height = height;
imgView.style.width = width;

timer = setInterval(load, config.renew * 60 * 1000);

ipcRenderer.on("reload", (event) => {
    index = 0;
    clearTimeout(timer);
    setInterval(load, 2000);
});

/**
 * FUNCTION: load()
 * PURPOSE: load the local images and display them
 */
function load() {
    if(index == 0) {
        //get all files in dir
        files = fs.readdirSync("./files")
        if (files.length > 0) {
            imgView.src = "../files/" + files[index];
            if (files.length == 1) {
                index = 0;
            } else {
                index++;
            }
        }
    } else {
        //display next image
        imgView.src = "../files/" + files[index];
        if(files.length-1 ==  index) {
            index = 0;
        } else {
            index++;
        }
    }
}