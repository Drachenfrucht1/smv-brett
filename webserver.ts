import * as express from "express";
import * as http from "http";
import * as webSocket from "ws";
import * as fs from "fs";

var app = express();
var server;
var string;

var conns = new Array<any>();

/**
 * FUNCTION: start()
 * PURPOSE: starts the webserver
 */
export function start() {
    server = http.createServer(app);

    //routes (hardcoded)
    app.get("/", (req, res) => {
        fs.readFile("./public/index.html", (err, data) => {
            if (err) {
                res.status(404).end();
                console.error(err);
                return;
            }

            res.writeHead(200, { "Content-Type": "text/html" });
            res.write(data);
            res.end();
        });
    });

    app.get("/index.js", (req, res) => {
        fs.readFile("./public/index.js", (err, data) => {
            if (err) {
                res.status(404).end();
                console.error(err);
                return;
            }

            res.writeHead(200, { "Content-Type": "text/javascript" });
            res.write(data);

            res.end();
        });
    });

    //file route
    app.get("/files/:file", (req, res) => {
        fs.readFile("./files/" + decodeURIComponent(req.params.file), (err, data) => {
            if(err) {
                res.status(404).end();
                console.error(err);
                return;
            }

            res.writeHead(200, { "Content-Type": "image/png"});
            res.write(data);
            res.end();
        });
    });

    const wss = new webSocket.Server({server});

    //add connection to conn array so it receives updates
    wss.on("connection", (ws, req) => {
        conns.push(ws);
        ws.send(string);
    });
    
    //start webserver
    server.listen(80, () => {
        console.log("Webserver started");
    });
}


/**
 * FUNCTION: update()
 * PURPOSE: send an update to all wss clients
 * 
 * @param files files to send with the update
 */
export function update(files: Array<file>) {
    string = "reload ";
    for(let i = 0; i < files.length; i++) {
        if (files[i].mime == "application/pdf") {
            string += encodeURIComponent(files[i].filenameWoExt) + ".png" + " ";
        } else {
            string += encodeURIComponent(files[i].basename) + " ";
        }
    }
    for(let i = 0; i < conns.length; i++) {
        if(conns[i].readyState == 1)
            conns[i].send(string);
    }
}