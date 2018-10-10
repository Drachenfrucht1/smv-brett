//IMPORTS
var index = 0;

var files = new Array<String>(); //array with all files

var timer; // id of the scheduler

var connection;

//imageview in which the images get presented
let imgView: HTMLImageElement = <HTMLImageElement>document.getElementById("img");

//correct size of imageview

timer = setInterval(load, 0.2 * 60 * 1000);

//open connection to webserver and add events
connection = new WebSocket("ws://localhost/ws");

connection.onopen = () => {
    console.log("Connected to WSS");
};

connection.onerror = (error) => {
    console.error(error);
}

connection.onmessage = (e) => {
    let msg = e.data;
    let split = msg.split(" ");

    //split message and add files to array
    if(split[0] == "reload") {
        index = 0;
        clearTimeout(timer);
        setInterval(load, 0.2 * 60 * 1000);

       files = new Array<String>();

        for(let i = 1; i < split.length - 1; i++) {
            files.push(split[i]);
        }
    }
}

/**
 * FUNCTION: load()
 * PURPOSE: load the local images and display them
 */
function load() {
    //display next image
    if(files[index] != (null || undefined)) {
        imgView.src = "http://localhost/files/" + files[index];
        if(files.length-1 ==  index) {
        index = 0;
        } else {
        index++;
        }
    }
}