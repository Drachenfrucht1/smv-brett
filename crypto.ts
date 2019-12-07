//IMPORTS
import * as crypto from "crypto";
var string = require("./string.js");

let create: boolean = false; 
let pw;

let iv: Buffer = new Buffer("sZXmKUGulRIFxYvK");

process.argv.forEach((val, index, array) => {

    if(index == 1 && val == __filename) {
        create = true;
    } else if(index == 2) {
        pw = val;
    }
});

if(create) {
    //display copyright notice
    console.log(
        "\n\nSMV-Brett - Das digitale Smv-Brett\n" +
        "Copyright (c) 2018 Dominik Sucker\n" +
        "This software is distributed under the MIT License\n\n"
    );
        //check if pw is given
    if(pw == (null || undefined)) {
        console.log("No password to encrypt specified!");
    } else {
        //encrypt and print result
        let key = string.createString(35);
        let hash = encrypt(pw, key);
        console.log("KEY: " + key);
        console.log("PW-HASH: " + hash + "\n\n");
    }
}

/**
 * FUNCTION: decrypt()
 * 
 * @returns decrypted string
 */
export function decrypt(string, key): string {
    let cipher = crypto.createDecipher("aes-256-cbc", key);
    let str = cipher.update(string, "hex", "utf8");
    str += cipher.final("utf8");
    return str;
}

/**
 * FUNCTION: encrypt()
 * 
 * @returns encrypted string
 */
export function encrypt(string, key): string {
    let cipher = crypto.createCipher("aes-256-cbc", key);
    let str = cipher.update(string, "uft8", "hex");
    str += cipher.final("hex");
    return str;
}