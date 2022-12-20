[![badge](https://img.shields.io/twitter/follow/api_video?style=social)](https://twitter.com/intent/follow?screen_name=api_video)

[![badge](https://img.shields.io/github/stars/apivideo/privatedelegatedtoken?style=social)](https://github.com/apivideo/privatedelegatedtoken)

[![badge](https://img.shields.io/discourse/topics?server=https%3A%2F%2Fcommunity.api.video)](https://community.api.video)

![](https://github.com/apivideo/.github/blob/main/assets/apivideo_banner.png)


[api.video](https://api.video) is the video infrastructure for product builders. Lightning fast video APIs for integrating, scaling, and managing on-demand & low latency live streaming features in your app.


# Private Delegated tokens & Delegated token adding options to video upload
NodeJS app to upload videos to api.video

## Installation 

1. Clone github repo
2. add environmental variables
3. install node dependancies
4. Run with 'node src/index.js'

## What the app does

When you add a video, there is a request to api.video to create a video. This creates the video 'container' with all the options selected in the form.  A delegated token (public upload key) is also created, with a 90s expiration.

The video container id (videoId) and the token are sent back to the broswer, and the upload begins.  The video is split into 1 MB segments. As long as the first segment uplads in 90s the token TTL), the video will successfully upload.

## Live demo

http://privatelyupload.a.video/
