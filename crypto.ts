//IMPORTS
var crypto = require("crypto");
var config = require("./config.json");

export function decrypt(string, key) {
    let cipher = crypto.createDecipher("aes-256-cbc", key);
    let str = cipher.update(string, "hex", "utf8");
    str += cipher.final("utf8");
    return str;
}

export function encrypt(string, key) {
    let cipher = crypto.createCipher("aes-256-cbc", key);
    let str = cipher.update(string, "uft8", "hex");
    str += cipher.final("hex");
    return str;
}