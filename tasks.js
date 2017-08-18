"use strict";

const async = require("async");
const cheerio = require("cheerio");
const request = require("request");
const settings = require("./settings");

/**
 * Scrape thepiratebay.org for the top 100 of everything, and return an object
 * full of top 100 data!
 */
function scrape(callback) {
    let torrents = {};

    async.each(Object.keys(settings.TPB_CATEGORIES), (key, cb) => {
        async.each(Object.keys(settings.TPB_CATEGORIES[key]), (k, c) => {
            let category = key + k.charAt(0).toUpperCase() + k.slice(1);
            let categoryNumber = settings.TPB_CATEGORIES[key][k];

            scrapeTop100(categoryNumber, (err, torrentData) => {
                if (err) {
                    return c(err);
                }

                torrents[category] = torrentData;
                c();
            });
        }, (err) => {
            if (err) {
                return cb(err);
            }

            cb();
        });
    }, (err) => {
        if (err) {
            return callback(err);
        }

        callback(null, torrents);
    });
}

/**
 * Given a pirate bay top 100 category number, scrape the page and extract all
 * of the top 100 torrents and their metadata.
 */
function scrapeTop100(categoryNumber, callback) {
    let url = settings.TPB_URL_TOP + "/" + categoryNumber;

    request(url, (err, resp, body) => {
        let $;
        let torrents = [];

        if (err || resp.statusCode !== 200) {
            return callback(new Error("Couldn't scrape data from", url + ". The website might be down :("));
        }

        $ = cheerio.load(body);
        torrents = [];

        $("table#searchResult tr").not(":first-child").each(function () {
            let name, size, url, seeds, leeches;
            name = $(this).find(".detName a").text();
            url = settings.TPB_URL + $(this).find("td ").not(":first-child").find("a").not(":first-child").attr("href");
            seeds = $(this).find("td[align=\"right\"]").first().text();
            leeches = $(this).find("td[align=\"right\"]").last().text();
            try {
                size = $(this).find(".detDesc").text().split(",")[1].split(" ")[2];
            }
            catch (err) {
                console.log(err.message);
                size = "NA";
            }
            if (name != '' || null) {
                torrents.push({name, size, url, seeds, leeches});
            }
        });

        return callback(null, torrents);
    });
}

module.exports = {scrape};
