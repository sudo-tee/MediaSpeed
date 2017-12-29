# MediaSpeed

An experimental mini media server like plex/emby. It tries to be fast light and easy.

MediaSpeed was inspired by this cool little node media servers:

https://github.com/OwenRay/Remote-MediaServer

https://github.com/jansmolders86/mediacenterjs

## Status

Everything is still very experimental

Right now MediaSpeed is only a scraper/indexer with a rest API, there is no gui

To create libraries you need to post them with the API

The Scanner does not start automatically, It can only be triggered by API


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
- <code>GET</code>    /api/tv/episodes [node-mongo-querystring](https://github.com/Turistforeningen/node-mongo-querystring) support
- <code>GET</code>    /api/tv/episodes/:uid
- <code>POST</code>   /api/tv/episodes
- <code>PUD</code>    /api/tv/episodes
- <code>DELETE</code> /api/tv/episodes

### Shows Resource
- <code>GET</code>    /api/tv/shows [node-mongo-querystring](https://github.com/Turistforeningen/node-mongo-querystring) support
- <code>GET</code>    /api/tv/shows/:uid
- <code>GET</code>    /api/tv/shows/:uid/seasons `Gets all the seasons of a show`               
- <code>GET</code>    /api/tv/shows/:uid/seasons/:sid `Gets a season for a show the seasons of a show by uid or by number`
- <code>GET</code>    /api/tv/shows/:uid/seasons/:sid/episodes `Gets episodes for a season in show`
- <code>GET</code>    /api/tv/shows/:uid/episodes `Gets all episodes for a show`
- <code>POST</code>   /api/tv/shows
- <code>PUD</code>    /api/tv/shows
- <code>DELETE</code> /api/tv/shows

### Seasons Resource
- <code>GET</code>    /api/tv/seasons [node-mongo-querystring](https://github.com/Turistforeningen/node-mongo-querystring) support
- <code>GET</code>    /api/tv/seasons/:uid
- <code>POST</code>   /api/tv/seasons
- <code>PUD</code>    /api/tv/seasons
- <code>DELETE</code> /api/tv/seasons

### Stream media file
- <code>GET</code>    /stream/movie/:uid `Range seekable raw stream for a movie` 
- <code>GET</code>    /stream/episode/:uid `Range seekable raw stream for an episode` 
- <code>GET</code>    /stream/transcode/movie/:uid `Experimental live ffmpeg transcoding` 
- <code>GET</code>    /stream/transcode/episode/:uid `Experimental live ffmpeg transcoding` 
- <code>GET</code>    /stream/hls/movie/:uid `Experimental live ffmpeg hls transcoding` 
- <code>GET</code>    /stream/hls/episode/:uid `Experimental live ffmpeg hls transcoding` 

#### Transcoding
Right the transcoding is very basic and is not to clever. you can seek through a video by adding the `q` parameter like so `?q=2973.84760964912` it will seek the video file to this timestamp (It will mess up the progress bar in the apps).

Hls transcoding provide a more native way of seeking with segments.


## To start the project
**Node v8.0 and above!** is required

Copy the config file sample 

``` 
cp config.json.dist config.json
```

And put your tmdb api key in the file
https://developers.themoviedb.org/3

Install the dependencies
``` 
yarn install
```


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
