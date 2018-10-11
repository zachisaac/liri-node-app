require("dotenv").config();

//Import Keys
var keys = require("./keys");
var axios = require("axios");
var moment = require("moment");
var Spotify = require("node-spotify-api");
var fs = require("fs");

var action = process.argv[2];
var title = process.argv.slice(3).join(" ");

function getConcerts() {
    var queryUrl = "https://rest.bandsintown.com/artists/" + title + "/events?app_id=codingbootcamp";
    axios.get(queryUrl).then(
        function (response) {
            if (response.data.length === 0) {
                console.log("No upcoming concerts for " + title);
                return;
            }
            console.log("Concerts for " + title);
            for (var i = 0; i < response.data.length; i++) {
                console.log("Location: " + response.data[i].venue.city + ", " + (response.data[i].venue.region || response.data[i].venue.country));
                console.log("Venue: " + response.data[i].venue.name);
                console.log("Date: " + moment(response.data[i].datetime).format("MM/DD/YYYY"));
                console.log("-----------------------");
            }
        }
    )
}
function getSongs() {
    if (!title) {
        title = "In My Feelings";
    }
    var spotify = new Spotify(keys.spotify);
    spotify.search({
        type: "track",
        query: title
    },
        function (error, data) {
            if (error) {
                console.log(error);
            } else {
                var tracks = data.tracks.items;
                for (var i = 0; i < tracks.length; i++) {
                    console.log("Song Name: " + tracks[i].name);
                    var artistArray = tracks[i].artists;
                    var artists = [];
                    for (var j = 0; j < artistArray.length; j++) {
                        artists.push(artistArray[j].name);
                    }
                    console.log(artists.join(", "));
                    console.log("Album Name: " + tracks[i].album.name);
                    console.log("Preview: " + tracks[i].preview_url);
                    console.log("-----------------------");
                }
            }
        }
    )
}
function getMovies() {
    var queryUrl = "http://www.omdbapi.com/?t=" + title + "&y=&plot=short&apikey=trilogy";
    axios.get(queryUrl).then(
        function (response) {
            if (response.data.length === 0) {
                console.log("No movies found for " + title);
                return;
            }
            console.log("Movies for " + title);
            for (var i = 0; i < response.data.length; i++) {
                console.log("Location: " + response.data[i].movie.year + ", " + (response.data[i].venue.region || response.data[i].venue.country));
                console.log("Venue: " + response.data[i].venue.name);
                console.log("Date: " + moment(response.data[i].datetime).format("MM/DD/YYYY"));
                console.log("-----------------------");
            }
        }
    )
}
function getRandom() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            console.log(error);
        } else {
            var dataArr = data.split(" ");
            action = dataArr[0];
            todo = dataArr.slice(1).join(" ");
            console.log(action, todo);
            doAction();
        }
    });
}

function doAction() {
    switch (action) {
        case "concert-this":
            getConcerts();
            break;
        case "spotify-this-song":
            getSongs();
            break;
        case "movie-this":
            getMovies();
            break;
        case "do-what-it-says":
            getRandom();
            break;
        default:
            console.log("Sorry we can't do that.");
    }


}
doAction();
