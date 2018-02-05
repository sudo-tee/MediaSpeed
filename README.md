# MediaSpeed

An experimental mini media server like plex/emby. It tries to be fast light and easy.

MediaSpeed was inspired by

https://github.com/OwenRay/Remote-MediaServer

https://github.com/jansmolders86/mediacenterjs

https://github.com/MediaBrowser/Emby

## Status

- Everything is still very experimental

- Right now MediaSpeed is only a scraper/indexer with a rest API

- To create libraries you need to post them with the API

- The scanner does not start automatically, It can only be triggered by API

- The scanning is stupid and will overwrite everything

- The transcoding is really basic


## To start the project
**Node v8.0 and above!** is required

Mediaspeed will create a folder in your home  ~/.media_speed/  open the config file

``` 
~/.media_speed/config.json 
```

And put your tmdb api key in the file
https://developers.themoviedb.org/3

Install the dependencies
``` 
yarn install
```

## GUI
There is a REACT GUI in the frontend/ folder

to start it in dev mode use the following command in the root folder of the project

``` 
yarn dev
```

# GUI un prod mode

The gui will be available in the /web url path

``` 
yarn build
yarn start
```
# To add a library 

``` 
curl -X POST \
 http://localhost:500/api/libraries -d '{"path": "/media/Movies", "name":"Movies", "type":"movie"}'
```

# To start a scan

``` 
curl -X POST http://localhost:500/api/libraries/scan
``` 


## Media Directory structure

MediaSpeed tries to work with any directory structure, but it work best if you follow these simple rules

### Movies

The movie naming convention should be `Movie (year).extension` eg: `FooBar (2017).mkv`

Let's say we have movie a named FooBar, theses 2 structure should work

``` 
/my/library/FooBar (2017).mkv
/my/library/FooBar (2017)/FooBar (2017).mkv
```

### TV Shows

The TV Shows Naming convention should be `Show Name S01E02 - Episode Title.extension` eg: `Foo Bar S01E02 - Episode Title.mkv`
If you put a tv with the same name show in 2 different folders MediaSpeed will treat them as 2 different by design

The ideal tv show structure would be one or the other

``` 
/my/library/FooBar/Foo Bar S01E02 - Episode Title.mkv
/my/library/FooBar/Season 01/Foo Bar S01E02 - Episode Title.mkv
```

## Rest API

Each GET api uses [node-mongo-querystring](https://github.com/Turistforeningen/node-mongo-querystring) to filter list of resources


### Libraries Resource
- <code>GET</code>    /api/libraries [node-mongo-querystring](https://github.com/Turistforeningen/node-mongo-querystring) support
- <code>GET</code>    /api/libraries/:uid
- <code>POST</code>   /api/libraries
- <code>PUD</code>    /api/libraries
- <code>DELETE</code> /api/libraries
- <code>POST</code> /api/libraries:id/scan `Start a scan for one specific libraries`
- <code>POST</code> /api/libraries/scan   `Start a scan for all libraries`    

### Movies Resource
- <code>GET</code>    /api/movies [node-mongo-querystring](https://github.com/Turistforeningen/node-mongo-querystring) support
- <code>GET</code>    /api/movies/:uid
- <code>POST</code>   /api/movies
- <code>PUD</code>    /api/movies
- <code>DELETE</code> /api/movies

### Episodes Shows Resource
- <code>GET</code>    /api/episodes [node-mongo-querystring](https://github.com/Turistforeningen/node-mongo-querystring) support
- <code>GET</code>    /api/episodes/:uid
- <code>POST</code>   /api/episodes
- <code>PUD</code>    /api/episodes
- <code>DELETE</code> /api/episodes

### Shows Resource
- <code>GET</code>    /api/shows [node-mongo-querystring](https://github.com/Turistforeningen/node-mongo-querystring) support
- <code>GET</code>    /api/shows/:uid
- <code>GET</code>    /api/shows/:uid/seasons `Gets all the seasons of a show`               
- <code>GET</code>    /api/shows/:uid/seasons/:sid `Gets a season for a show the seasons of a show by uid or by number`
- <code>GET</code>    /api/shows/:uid/seasons/:sid/episodes `Gets episodes for a season in show`
- <code>GET</code>    /api/shows/:uid/episodes `Gets all episodes for a show`
- <code>POST</code>   /api/shows
- <code>PUD</code>    /api/shows
- <code>DELETE</code> /api/shows

### Seasons Resource
- <code>GET</code>    /api/seasons [node-mongo-querystring](https://github.com/Turistforeningen/node-mongo-querystring) support
- <code>GET</code>    /api/seasons/:uid
- <code>POST</code>   /api/seasons
- <code>PUD</code>    /api/seasons
- <code>DELETE</code> /api/seasons

### Stream media file
- <code>GET</code>    /stream/movie/:uid `Range seekable raw stream for a movie` 
- <code>GET</code>    /stream/episode/:uid `Range seekable raw stream for an episode` 
- <code>GET</code>    /transcode/movie/:uid `Experimental live ffmpeg transcoding` 
- <code>GET</code>    /transcode/episode/:uid `Experimental live ffmpeg transcoding` 

#### Transcoding
Right the transcoding is very basic and is not to clever. you can seek through a video by adding the `q` parameter like so `?q=2973.84760964912` it will seek the video file to this timestamp 
(It will mess up the progress bar in the apps like vlc or kodi).


### Transcoding media file using hls
- <code>GET</code>    /hls/movie/:uid?session=SESSION_ID `Experimental live ffmpeg hls transcoding` 
- <code>GET</code>    /hls/episode/:uid?session=SESSION_ID `Experimental live ffmpeg hls transcoding` 

The hls transcoder is very experimental and seeking sometime cause locking in the web player (hls.js and shaka.js)

It is inspired by how Emby does it. In fact it produce almost the same ffmpeg commands as Emby... They are the only ones working well for me.
It creates a fake VOD m3u8 playlist with all the predicted segments and forces key frames with ffmpeg
If the codec is not h264 it will transcode video and audio
If the codec is h264 it will streamcopy the video but still encode the audio. (This can cause the webplayer to lock if you seek to much, because keyframes are not constant)

The goal of mediaspeed is not transcoding, so for now this method is what I call "Good enough" for streaming with a web player


### Stream media file using dash
- <code>GET</code>    /dash/movie/:uid `Experimental live ffmpeg dash transcoding` 
- <code>GET</code>    /dash/episode/:uid `Experimental live ffmpeg dash transcoding` 

The dash transcoder is very experimental and seeking only works in player like vlc
It is inspired by how Plex does it, but due to some missing flags in ffmpeg (starting segment number) (segment time shift) 
The seek does not work and probably never will... until ffmpeg add theses option (which are in the Plex transcoder)
The seek works in VLC but will make MPV crash. So it's not recommended for now

The code is there as a reference, there is no "session handling" so you can't start 2 transcoding process of the same file

#### Known limitations of transcoding
- There is no client detection right now so pick the right url to stream your video
- The codec detection only works in hls right now the other methods are there as a reference for later
- The codec detection is really bad and basic a simple if h264 ... I will add them later if needed


There are a few defined run scripts, here's a list of them with a description of what they do. To run them, simply execute `npm run <script name>` - e.g. `npm run dev`

* `start`: Used by the production environment to start the app. This will run a compiled version, so you need to execute `build` first.
* `build`: Runs the `babel` CLI to compile the app. Files are emitted to `dist/`.
* `dev`: Runs the app in development mode - uses `babel-node` to compile on-the-fly. Also uses `nodemon` to automatically restart when 


# Author

* Francis Bélanger - inkubux

# License

MIT.

# references

[koa-es7-boilerplate](https://github.com/jeffijoe/koa-es7-boilerplate)

[Remote-MediaServer](https://github.com/OwenRay/Remote-MediaServer)

[MediaCenterJS](https://github.com/jansmolders86/mediacenterjs)

[node-mongo-querystring](https://github.com/Turistforeningen/node-mongo-querystring)
