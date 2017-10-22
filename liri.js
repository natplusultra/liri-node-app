// dependencies
var fs = require("fs");
var request = require("request");
var twitter = require("twitter"); 
var spotifyAPI = require("node-spotify-api");
var keys = require("./keys.js");

// stores all of the arguments in an array
var nodeArgs = process.argv;

// stores the argument at the second index as the command
var command = process.argv[2];

// creates an empty string for storing the user's song or movie name
var userInput = "";

// loops through to capture all of the words in the song or movie name and stores them in the userInput string
function storeInput() {
	for (var i = 3; i < nodeArgs.length; i++) {
		userInput = userInput + " " + nodeArgs[i];
	}

	console.log("Searching for: " + userInput +"\n");
}

// function to call and return tweets
function myTweets() {
	var client = new twitter(keys.twitterKeys);

	var params = {screen_name: "ecstatictruths"};

	client.get("statuses/user_timeline", params, function(error, tweets, response) {
		if (error) {
			return console.log(error);
		}
		// console.log(JSON.stringify(tweets, null, 2));

		console.log("\nHERE ARE THE LAST 20 TWEETS:\n\n");
		fs.appendFile("log.txt", "\nHERE ARE THE LAST 20 TWEETS:\n\n", function(err) {
			if (err) {
				console.log(err);
			}
		});

		// loops through the returned tweets object and console.logs the most recent 20 tweets and when they were tweeted
		for (var i = 0; i < 20; i++) {
			// logs to the terminal
			console.log(tweets[i].text + "\nTweeted on: " + tweets[i].created_at + "\n---------------\n");

			// logs to the log.txt file
			fs.appendFile("log.txt", tweets[i].text + "\nTweeted on: " + tweets[i].created_at + "\n---------------\n", function(err) {
				
				if (err) {
					console.log(err);
				} 
			});
		}
	});
}

// function to call and return user's provided song
function spotifyThisSong() {
	storeInput();

	var spotify = new spotifyAPI(keys.spotifyKeys);
	var query;

	// if the user provides a song, that song will be queried; otherwise, "The Sign" will be queried
	if (userInput !== "" && userInput !== null) {
		query = userInput;
	} else {
		query = "The Sign";
	}

	spotify.search({type: "track", query: query}, function(err, data) {
  		if (err) {
    		return console.log("Error occurred: " + err);
  		}
		// console.log(JSON.stringify(data, null, 2)); 

		// logs to the terminal
		console.log("\nTHE SONG YOU REQUESTED:\n\n" + "Artist: " + data.tracks.items[0].album.artists[0].name + "\nSong: " + query + "\nAlbum: " + data.tracks.items[0].album.name + "\nPreview link: " + data.tracks.items[0].album.artists[0].external_urls.spotify + "\n---------------\n");

		// logs to the log.txt file
		fs.appendFile("log.txt", "\nTHE SONG YOU REQUESTED:\n\n" + "Artist: " + data.tracks.items[0].album.artists[0].name + "\nSong: " + query + "\nAlbum: " + data.tracks.items[0].album.name + "\nPreview link: " + data.tracks.items[0].album.artists[0].external_urls.spotify + "\n---------------\n", function(err) {

			if (err) {
				console.log(err);
			} else {
				console.log("Song added!");
			}
		});
	});
}

// function to call and return user's provided movie
function movieThis() {
	var movieName;
	storeInput();

	// if the user provides a movie name, that movie will be queried; otherwise, "Mr. Nobody" will be queried
	if (userInput !== "" && userInput !== null) {
		movieName = userInput;
	} else {
		movieName = "Mr. Nobody";
	}

	var queryURL = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";
	console.log(queryURL);

	request(queryURL, function(err, response, body) {
		if (!err && response.statusCode === 200) {
			// console.log(JSON.parse(body));

			// logs to the terminal
			console.log("\nTHE MOVIE YOU REQUESTED:\n\n" + "Title: " + JSON.parse(body).Title + "\nYear: " + JSON.parse(body).Year + "\nIMDB Rating: " + JSON.parse(body).imdbRating + "\nCountry: " + JSON.parse(body).Country + "\nLanguage: " + JSON.parse(body).Language + "\nPlot: " + JSON.parse(body).Plot + "\nActors: " + JSON.parse(body).Actors + "\n---------------\n");

			// logs to the log.txt file
			fs.appendFile("log.txt", "\nTHE MOVIE YOU REQUESTED:\n\n" + "Title: " + JSON.parse(body).Title + "\nYear: " + JSON.parse(body).Year + "\nIMDB Rating: " + JSON.parse(body).imdbRating + "\nCountry: " + JSON.parse(body).Country + "\nLanguage: " + JSON.parse(body).Language + "\nPlot: " + JSON.parse(body).Plot + "\nActors: " + JSON.parse(body).Actors + "\n---------------\n", function(err) {

				if (err) {
					console.log(err);
				} else {
					console.log("Movie added!");
				}
			});
		}
	});
}

function doWhatItSays() {
	// reads the content inside random.txt
	fs.readFile("random.txt", "utf8", function(err, data) {
		if (err) {
			return console.log(err);
		}
		// console.log(data);

		// stores the returned data as an array, split where there are commas
		var dataArray = data.split(",");
		console.log(dataArray);

		// sets the command and user query by index number
		command = dataArray[0];
		userInput = dataArray[1];

		// determines which function and query to run 
		switch (command) {
			case "my-tweets":
			myTweets();
			break;

			case "spotify-this-song":
			spotifyThisSong();
			break;

			case "movie-this":
			movieThis();
			break;
		}
	});
}

// a switch-case statement that will determine which function to run
switch (command) {
	case "my-tweets":
	myTweets();
	break;

	case "spotify-this-song":
	spotifyThisSong();
	break;

	case "movie-this":
	movieThis();
	break;

	case "do-what-it-says":
	doWhatItSays();
	break;
}

