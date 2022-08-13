#!/usr/bin/env node
import fetch from "node-fetch";
import readline from "readline";
// import fs from "fs";

main();
async function main() {
    // https://www.youtube.com/playlist?list=PL6NdkXsPL07KN01gH2vucrHCEyyNmVEx4

    const url = await ask("Please enter a YouTube playlist url\n> ");
    if (!url.includes("https://www.youtube.com/playlist?list=")) {
        console.log("Invalid url, please try one formatted like this https://www.youtube.com/playlist?list=PL1234");
        main();
        return;
    }
    const response = await fetch(url);
    const body = await response.text();
    // var body = fs.readFileSync("output.html", "utf8");

    const regex = RegExp("lengthText(.*?)navigationEndpoint", "gm");
    let playlistEntries = body.match(regex);

    let times;
    let hours = [];
    let minutes = [];
    let seconds = [];
    playlistEntries.forEach((entry) => {
        times = entry.match(/simpleText":"(\d*):(\d\d):?(\d\d)?"/);
        if (times[3]) {
            hours.push(times[1]);
            minutes.push(times[2]);
            seconds.push(times[3]);
        } else {
            minutes.push(times[1]);
            seconds.push(times[2]);
        }
    });
    let total = 0.0;
    minutes.forEach((minute) => {
        total += parseInt(minute);
    });
    let secondsTotal = 0.0;
    seconds.forEach((second) => {
        secondsTotal += parseInt(second);
    });
    total = (total + secondsTotal / 60) / 60;
    if (hours) {
        hours.forEach((hour) => {
            total += parseInt(hour);
        });
    }

    console.log("Playlist length:", playlistEntries.length, "videos /", parseFloat(total).toFixed(2), "hours");
}

function ask(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise((resolve) =>
        rl.question(query, (ans) => {
            rl.close();
            resolve(ans);
        })
    );
}
