"use strict";

module.exports = {
    //admin mail
    ADMIN_EMAIL: "rhounslow@gmail.com",

    // Enable debugging mode (useful for local development).
    DEBUG: process.env.DEBUG,

    // This is the port we'll run the local web server on.
    DEFAULT_PORT: '3000',

    // Amount of time (in ms) between torrent data updates. (1 hour)
    INDEX_UPDATE_INTERVAL: 1000 * 60 * 60,

    //https://proxybay.one/  <- all with correct magnet links
    TPB_URL: "https://thepiratebay.red/",
    TPB_URL_TOP: "https://thepiratebay.red/top",

    TPB_CATEGORIES: {
        audio: {
            music: 101,
            books: 102,
            soundClips: 103,
            flac: 104,
            other: 199
        },
        video: {
            movies: 201,
            moviesDVDR: 202,
            musicVideos: 203,
            movieClips: 204,
            tvShows: 205,
            handheld: 206,
            hdMovies: 207,
            hdTVShows: 208,
            "3d": 209,
            other: 299
        },
        applications: {
            windows: 301,
            mac: 302,
            unix: 303,
            handheld: 304,
            ios: 305,
            android: 306,
            other: 399
        },
        games: {
            pc: 401,
            mac: 402,
            psx: 403,
            xbox360: 404,
            wii: 405,
            handheld: 406,
            ios: 407,
            android: 408,
            other: 499
        },
        //porn: {
        //  movies: 501,
        //  moviesDVDR: 502,
        //  pictures: 503,
        //  games: 504,
        //  hdMovies: 505,
        //  movieClips: 506,
        //  other: 599
        //},
        other: {
            eBooks: 601,
            comics: 602,
            pictures: 603,
            covers: 604,
            physibles: 605,
            other: 699
        }
    }
};
