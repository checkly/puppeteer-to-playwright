//read a javascript file and iterate over it to replace puppeteer commands with playwright commands
//replace puppeteer commands with playwright commands
const fs = require('fs');

//read puppeteer-example.js file
fs.readFile('puppeteer-example.js', 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }
    //split the file into lines
    var lines = data.split('\n');
    //iterate over the lines
    for (var i = 0; i < lines.length; i++) {
        //if the line contains puppeteer command
        if (lines[i].includes('puppeteer')) {
        //replace puppeteer command with playwright command
        lines[i] = lines[i].replace('puppeteer', 'playwright');
        }
    }
    //write the file
    fs.writeFile('playwright-example.js', lines.join('\n'), 'utf8', function (err) {
        if (err) return console.log(err);
    });
    });