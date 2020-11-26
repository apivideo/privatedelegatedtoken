require('dotenv').config();
//import express from 'express';
const Discord = require('discord.js');
const discordClient = new Discord.Client();
// when the client is ready, run this code
// this event will only trigger one time after logging in
discordClient.once('ready', () => {
	console.log('discord Ready!');
});

// login to Discord with your app's token
//ginstructions for a discord API toke:
//https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot
discordClient.login(process.env.discordKey);



//apivideo
const apiVideo = require('@api.video/nodejs-sdk');


//if you chnage the key to sandbox or prod - make sure you fix the delegated toekn on the upload page
const apiVideoKey = process.env.apiProductionKey;

// website demo
//get request is the initial request - load the HTML page with the form
app.get('/', (req, res) => {
		res.sendFile(path.join(__dirname, '../public', 'index.html'));  
});





app.post('/', (req, res) => {
	console.log(req);
	//get values from POST body
	let videoId=req.body.videoId;
	let videoName = req.body.videoName;
	let videoDesc = req.body.videoDesc;
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
		discordClient.guildObj.defaultChannel.send('My Message');
		


	}).catch((error) => {
	    console.log(error);
	});
	
	

});


//testing on 3004
app.listen(3004, () =>
  console.log('Example app listening on port 3004!'),
);
process.on('uncaughtException', function(err) {
    // handle the error safely
    console.log(err)
    // Note: after client disconnect, the subprocess will cause an Error EPIPE, which can only be caught this way.
});



	