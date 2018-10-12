require("dotenv").config();

//Import Keys
var keys = require("./keys");
var axios = require("axios");
var moment = require("moment");
var Spotify = require("node-spotify-api");
var fs = require("fs");
var omdb = require('omdb');

//Arguments
var action = process.argv[2];
var title = process.argv.slice(3).join(" ");

//BANDS IN TOWN
//Get Concert Function
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

    if (!title) {
        title = "Mr.Nobody";
    }
    var queryUrl = "http://www.omdbapi.com/?t=" + title + "&y=&plot=short&apikey=trilogy";

    axios.get(queryUrl).then(
        function (response) {
            if (response.data.length === 0) {
                console.log("No movies for " + title);
                return;
            }
            console.log("Movies for " + title);
            //response.data is an object, cannot iterate as if was array

            //console.log(response.data);
            console.log(response.data.Title + ", " + response.data.Year + ", " + response.data.Plot);
            console.log(response.data.imdbRating);
            //console.log("-----------------------");

            if (response.data.Ratings[1]) {
                console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
                console.log("-----------------------");
            }
        })
}

/*function getMovies() {
    var queryUrl = "http://www.omdbapi.com/?t=" + title + "&y=&plot=short&apikey=trilogy";
 
}
 
omdb.search('saw', function(err, movies) {
    if(err) {
        return console.error(err);
    }
 
    if(movies.length < 1) {
        return console.log('No movies were found!');
    }
 
    movies.forEach(function(movie) {
        console.log('%s (%d)', movie.title, movie.year);
    });
 
    // Saw (2004)
    // Saw II (2005)
    // Saw III (2006)
    // Saw IV (2007)
    // ...
});*/




/*function getMovies() {
    var queryUrl = "http://www.omdbapi.com/?t=" + title + "&y=&plot=short&apikey=trilogy";
    axios.get(queryUrl).then(
        function (response) {
            if (response.data.length === 0) {
                console.log("No movies found for " + title);
                return;
            }
            console.log("Movies for " + title);
            for (var i = 0; i < response.data.length; i++) {
                console.log("Location: " + response.data[i].title.year + ", " + (response.data[i].venue.region || response.data[i].venue.country));
                console.log("Venue: " + response.data[i].venue.name);
                console.log("Date: " + moment(response.data[i].datetime).format("MM/DD/YYYY"));
                console.log("-----------------------");
            }
        }
    )
}*/
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
