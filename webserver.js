"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const http = require("http");
const webSocket = require("ws");
const fs = require("fs");
var app = express();
var server;
var string;
var conns = new Array();
/**
 * FUNCTION: start()
 * PURPOSE: starts the webserver
 */
function start() {
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
        fs.readFile("./files/" + req.params.file, (err, data) => {
            if (err) {
                res.status(404).end();
                console.error(err);
                return;
            }
            res.writeHead(200, { "Content-Type": "image/png" });
            res.write(data);
            res.end();
        });
    });
    const wss = new webSocket.Server({ server });
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
exports.start = start;
/**
 * FUNCTION: update()
 * PURPOSE: send an update to all wss clients
 *
 * @param files files to send with the update
 */
function update(files) {
    string = "reload ";
    for (let i = 0; i < files.length; i++) {
        if (files[i].mime == "application/pdf") {
            string += files[i].filenameWoExt + ".png" + " ";
        }
        else {
            string += files[i].basename + " ";
        }
    }
    for (let i = 0; i < conns.length; i++) {
        conns[i].send(string);
    }
}
exports.update = update;
