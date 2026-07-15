#!/usr/bin/env node
import * as readline from "readline";
import fetch from "node-fetch";

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
    // fs.writeFileSync("output.html", body, "utf-8");

    const regex = RegExp('"text":"(.*?)","badgeStyle"', "gm");
    let playlistEntries = body.match(regex);

    let times;
    let hours: string[] = [];
    let minutes: string[] = [];
    let seconds: string[] = [];
    if (playlistEntries) {
        playlistEntries.forEach((entry) => {
            times = entry.match(/text":"(\d*):(\d\d):?(\d\d)?"/);
            if (times && times[3]) {
                hours.push(times[1]);
                minutes.push(times[2]);
                seconds.push(times[3]);
            } else if (times) {
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

        console.log("Playlist length:", playlistEntries.length, "videos /", parseFloat(String(total)).toFixed(2), "hours");
    } else {
        console.log("Parsing error");
    }
}

function ask(query: string): Promise<string> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise((resolve) =>
        rl.question(query, (ans) => {
            rl.close();
            resolve(ans);
        }),
    );
}
