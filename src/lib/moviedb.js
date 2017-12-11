import MovieDb from 'moviedb';
// import MovieDb from '../misc/mockmoviedb';
// Modified from MediacenterJS
// @see https://github.com/jansmolders86/mediacenterjs/blob/master/lib/utils/moviedb-wrapper.js

// tmdb currently allows 40 requests per 10 seconds
const PERIOD = 10000; // 10 seconds
const MAX_REQUESTS = 40;

const waiting = [];
const pending = [];
let timeoutId = null;

function processRequests(newRequest) {
    timeoutId && clearTimeout(timeoutId);

    newRequest && waiting.push(newRequest);

    const expired = Date.now() - PERIOD;
    while (pending.length && pending[0] < expired) {
        pending.shift();
    }

    if (pending.length < MAX_REQUESTS - 1 && waiting.length) {
        waiting.shift()(); // start next request
        pending.push(Date.now());
    }

    if (waiting.length) {
        timeoutId = setTimeout(processRequests, PERIOD / MAX_REQUESTS);
    }
}

export default function createMovieDbApi(movieDbApiKey, logger) {
    const moviedb = new MovieDb(movieDbApiKey);
    moviedb.token = { expires_at: '2900-01-01' }; // we don't need the token, prevent a request for it from being made

    const execute = function(method, searchOptions, allResults) {
        let searchResolve, searchReject;

        const promise = new Promise(function(resolve, reject) {
            searchResolve = resolve;
            searchReject = reject;
        });

        const makeRequest = function() {
            method.call(moviedb, searchOptions, function(err, result) {
                if (err && err.status === 429) {
                    logger.warn('Movie Db request is over limit we will try again later');
                    // over request limit, try again later
                    processRequests(makeRequest);
                    return;
                }

                if (err || !result) {
                    searchReject([err, searchOptions]);
                }

                if (result.results !== undefined && result.results.length) {
                    let results = allResults ? result.results : result.results[0];
                    searchResolve(results);
                }

                if (result.id) {
                    searchResolve(result);
                }

                searchReject({ query: searchOptions, results: result, message: 'not found' });
            });
        };

        processRequests(makeRequest);

        return promise;
    };

    return {
        searchMovie: function(searchOptions) {
            return execute(moviedb.searchMovie, searchOptions);
        },
        searchTv: function(searchOptions) {
            return execute(moviedb.searchTv, searchOptions);
        },
        tvInfo: function(searchOptions) {
            return execute(moviedb.tvInfo, searchOptions);
        },
        movieInfo: function(searchOptions) {
            return execute(moviedb.movieInfo, searchOptions);
        },
        discoverMovie: function(searchOptions) {
            return execute(moviedb.discoverMovie, searchOptions, true);
        }
    };
}
