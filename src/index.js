require('dotenv').config();
//import express from 'express';
const express = require('express');
//express for the website and pug to create the pages
const app = express();
bodyParser = require('body-parser');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine','pug');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
var request = require("request");
const Discord = require('discord.js');
const discordClient = new Discord.Client();
// when the client is ready, run this code
// this event will only trigger one time after logging in
discordClient.once('ready', () => {
	console.log('discord Ready!');

});





//apivideo
const apiVideo = require('@api.video/nodejs-sdk');


//if you chnage the key to sandbox or prod - make sure you fix the delegated toekn on the upload page
const apiVideoKey = process.env.apiProductionKey;

// website demo
//get request is the initial request - load the HTML page with the form
app.get('/', (req, res) => {
		res.sendFile(path.join(__dirname, '../public', 'index.html'));  
});


app.post('/createVideo', (req,res) => {
	console.log("request body",req.body);
	//now we'll make 2 rewquests to apivideo
	//1 create a videoId for the uppload, with any desired params
	//2 create a delegated token for the upload
	var public = true;
	if(req.body.public === "false"){
		public=false;
	}
	var mp4  = true;
	if(req.body.mp4Support === "false"){
		mp4=false;
	}
	var title = req.body.title;
	var descr = req.body.description;

	client = new apiVideo.Client({ apiKey: apiVideoKey});	
	
	
	let result = client.videos.create(title, {	"title": title, "mp4Support": mp4,
		"public": public, 
		"description": descr,					
	});
	console.log(result);
	result.then(function(video) {
		console.log(video);
		var videoId = video.videoId;
		console.log(videoId);
		//ok have a new videoId for the video - now create a delegated token
		//since the new delegated token with TTL is not yet in the Node SDK, I'll have to authenticate 
		//and then request a token - 2 calls to api.video
		var authOptions = {
			method: 'POST',
			url: 'https://ws.api.video/auth/api-key',
			headers: {
				accept: 'application/json'
				
			},
			json: {"apiKey":apiVideoKey}

		}
		console.log(authOptions);	
		request(authOptions, function (error, response, body) {
			if (error) throw new Error(error);
			//this will give me the api key
			
			var authToken = body.access_token;
			console.log(authToken);
			//now use this to generate a delegated toke with a ttl of 90s
			var tokenTTL = 90;
			var tokenOptions = {
				method: 'POST',
				url: 'https://ws.api.video/upload-tokens',
				headers: {
					accept: 'application/json',
					authorization: 'Bearer ' +authToken
				},
				json: {"ttl":tokenTTL}
	
			}
			request(tokenOptions, function (error, response, body) {
				if (error) throw new Error(error);
				var delegatedToken = body.token;
				var tokenExpiry = body.expiresAt;
				console.log("new token", delegatedToken);
				console.log("new token expires", tokenExpiry);
				var tokenVideoIdJson = {"token": delegatedToken,
										"expires":tokenExpiry,
										"videoId": videoId};
				res.setHeader('Content-Type', 'application/json');
				res.end(JSON.stringify(tokenVideoIdJson));

			});


			
	 	   
		});	

		
	}).catch((error) => {
		console.log(error);
	});	




});


app.post('/', (req, res) => {
	console.log(req.body);
	//console.log(req);
	//get values from POST body
	let videoId=req.body.videoId;
	let videoName = req.body.videoName;
	let videoDesc = req.body.videoDesc;
	let discordChannel = req.body.channel;
	let tag = "Discord";
	

	

	client = new apiVideo.Client({ apiKey: apiVideoKey});
	
	

	let result = client.videos.update(videoId, {	title: videoName, 
													description: videoDesc,					
													tags: [tag]
											});
											console.log(result);
	result.then(function(video) {
		console.log("video uploaded and renamed");
		//video name changed.  
		//now send it to discord
		//
		console.log(video);
		var playerUrl = video.assets.player;

		//we now have updated the video, and have the url - butu let's wait until the video is playeble before posting on discord (so the oembed works properly.)
		function checkPlayable(videoId) {
			console.log("checking mp4 encoding status");
			let status = client.videos.getStatus(videoId);
			status.then(function(videoStats){
			 // console.log(videoStats);
			  let playable = videoStats.encoding.playable;
			  let qualitylist = videoStats.encoding.qualities;
			  console.log("is video playable?", playable);
			  //only look for the mp4 if the video is playable
			  //when still encoding, sometimes the mp4 status does not appear immediately
			  if(playable){
				 console.log("video is playable");
				//send to discord
				//send 200 back to page
				var channel = discordClient.channels.cache.get(discordChannel);
				channel.send( videoDesc + playerUrl);
				res.sendStatus(200);

			  }else{
				  setTimeout(checkPlayable,2000,videoId);
			  }
		  }).catch((error) => {
				console.log(error);
			});	
		}
		checkPlayable(videoId);



	}).catch((error) => {
	    console.log(error);
	});
	
	

});


//testing on 3021
app.listen(3021, () =>
  console.log('Example app listening on port 3021!'),
);
process.on('uncaughtException', function(err) {
    // handle the error safely
    console.log(err)
    // Note: after client disconnect, the subprocess will cause an Error EPIPE, which can only be caught this way.
});



	