"use strict";

const async = require("async");
const cheerio = require("cheerio");
const request = require("request");
const settings = require("./settings");

let torrents = {};

/**
 * Scrape thepiratebay.org for the top 100 of everything, and return an object
 * full of top 100 data!
 */
function scrape(callback) {

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


    /**
     * Given a pirate bay top 100 category number, scrape the page and extract all
     * of the top 100 torrents and their metadata.
     */
    function scrapeTop100(categoryNumber, callback) {
        let urlCategory = settings.TPB_URL_TOP + "/" + categoryNumber;

        request(urlCategory, function (err, resp, body) {
            let $;
            let torrents = [];

            if (err || resp.statusCode !== 200) {
                return callback(new Error("Couldn't scrape data from", urlCategory + ". The website might be down :("));
            }

            $ = cheerio.load(body);

            $("table#searchResult tr").not(":first-child").each(function () {
                let name, size, urlDownload, magnet, seeds, leeches;

                name = $(this).find(".detName a").text();
                urlDownload = settings.TPB_URL + $(this).find("td").not(":first-child").find("a").attr("href");
                magnet = $(this).find("td").not(":first-child").find("a").not(":first-child").attr("href");

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
                    torrents.push({name, size, urlDownload, seeds, leeches, magnet});
                }
            });

            return callback(null, torrents);
        });
    }
}

module.exports = {scrape};
