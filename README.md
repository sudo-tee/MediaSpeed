# MediaSpeed

An experimental mini media server like plex/emby. It tries to be fast and light easy.

MediaSpeed was inspired by this cool little node media server:

https://github.com/OwenRay/Remote-MediaServer

## Status

Right now MediaSpeed is only a scraper/indexer with a rest API, there is no gui


## Media Directory structure

MediaSpeed tries to work with any directory structure, but it work best of you follow these simple rules

### Movies

The movie naming convention should be `Movie (year).extension` eg: `FooBar (2017).mkv`

Let's say we have movie a named FooBar, theses 3 structure should work

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

### Movies Resource
- <code>GET</code>    /api/movies [node-mongo-querystring](https://github.com/Turistforeningen/node-mongo-querystring) support
- <code>GET</code>    /api/movies/:uid
- <code>POST</code>   /api/movies
- <code>PUD</code>    /api/movies
- <code>DELETE</code> /api/movies

### Tv Shows Resource
- <code>GET</code>    /api/tv [node-mongo-querystring](https://github.com/Turistforeningen/node-mongo-querystring) support
- <code>GET</code>    /api/tv/:uid
- <code>POST</code>   /api/tv
- <code>PUD</code>    /api/tv
- <code>DELETE</code> /api/tv


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

[node-mongo-querystring](https://github.com/Turistforeningen/node-mongo-querystring)
