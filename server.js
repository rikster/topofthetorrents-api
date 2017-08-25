"use strict";

const async = require("async");
const express = require("express");

const settings = require("./settings");
const tasks = require("./tasks");

const PORT = process.env.PORT || settings.DEFAULT_PORT;

let TORRENT_DATA;
let app = express();
let updateTimes = 0;

// If we're running in production on Heroku, we should trust that the proxy is
// securing the incoming request.
if (!settings.DEBUG) {
    app.enable("trust proxy");
}

/**
 * Return a list of available torrent categories.
 */
app.get("/", (req, res) => {
    let categories = [];

    if (!TORRENT_DATA) {
        return res.status(503).json({error: "Currently rebuilding the torrent index. Please try again in a moment!"});
    }

    async.each(Object.keys(TORRENT_DATA), (item, element) => {
        //let url = req.protocol + "://" + req.hostname + (settings.DEBUG ? ":" + PORT : "") + "/" + item;
        let url = req.protocol + "://" + req.hostname + ":" + PORT + "/" + item;
        //let url = req.protocol + "://" + req.hostname  + "/" + item;
        categories.push(url);
    });

    res.json({categories});
});

/**
 * Return the top 100 torrents for the specified category.
 */
app.get("/:categoryName", (req, res, next) => {
    let categoryName = req.params.categoryName;

    if (!TORRENT_DATA[categoryName]) {
        return res.status(400).json({error: "Invalid categoryName specified. Please try again. Full list of valid categories available at / endpoint."});
    }

    res.json({torrents: TORRENT_DATA[categoryName]});
});

/**
 * Handle 404s.
 */
app.use((req, res, next) => {
    res.status(404).json({
        error: "API endpoint does not exist."
    })
});

/**
 * Handle errors.
 */
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({error: "Something bad happened! If this problem persists, please email me: " + settings.ADMIN_EMAIL});
});

/**
 * When the server first starts up, we'll do our scraping and build the index.
 */
console.log("Updating torrent index 1st time.");
tasks.scrape((err, data) => {
    if (err) {
        console.error(err);
    } else {
        TORRENT_DATA = data;
    }
});

/**
 * Re-build the torrent index every so often.
 */
setInterval(() => {
    console.log("Updating torrent index. (" + updateTimes + " time)");
    tasks.scrape((err, data) => {
        if (err) {
            console.error(err);
        } else {
            TORRENT_DATA = data;
        }
    });


}, settings.INDEX_UPDATE_INTERVAL);

app.listen(PORT);
console.log("Running server on PORT:", PORT);
