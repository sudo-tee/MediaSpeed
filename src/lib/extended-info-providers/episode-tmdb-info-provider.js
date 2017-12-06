import memoize from 'memoized-decorator';
import { pick } from 'lodash';

const showFields = [
    'backdrop_path',
    'created_by',
    'first_air_date',
    'genres',
    'homepage',
    'in_production',
    'languages',
    'last_air_date',
    'name',
    'networks',
    'number_of_episodes',
    'number_of_seasons',
    'origin_country',
    'original_language',
    'original_name',
    'overview',
    'popularity',
    'poster_path',
    'production_companies',
    'status',
    'vote_average',
    'vote_count'
];

const seasonFields = ['air_date', 'name', 'overview', 'poster_path', 'season_number'];

const episodeFields = [
    'episode_number',
    'season_number',
    'name',
    'air_date',
    'crew',
    'guest_stars',
    'overview',
    'id',
    'production_code',
    'still_path',
    'vote_average',
    'vote_count'
];

export default class EpisodeTmdbInfoProvider {
    constructor(movieDbApi) {
        this.movieDbApi = movieDbApi;
    }

    async execute(episode) {
        const episodeInfo = await this.getepisodeInfo(episode);

        return { ...episode, ...episodeInfo };
    }

    async getepisodeInfo(episode) {
        console.log('fetching information for ' + episode.episode.show_name);

        let shows = await this.searchEpisode(episode.episode.show_name);

        if (!shows.results.length) {
            return episode;
        }

        const showDetails = await this.getEpisodeDetails(shows.results[0].id, episode.episode.season_number);
        const seasonDetails = this.getSeasonDetails(showDetails, episode.episode.season_number);
        const episodeDetails = seasonDetails['episodes'][episode.episode.episode_number - 1];

        return {
            show: {
                ...episode.show,
                ...pick(showDetails, showFields),
                ...{ tmdb_id: showDetails.id }
            },
            episode: {
                ...episode.episode,
                ...pick(episodeDetails, episodeFields),
                ...{ tmdb_id: episodeDetails.id }
            },
            season: {
                ...episode.season,
                ...pick(seasonDetails, seasonFields),
                ...{ tmdb_id: seasonDetails.id }
            }
        };
    }

    @memoize
    async searchEpisode(title) {
        console.log('no cache searchepisode', title);
        try {
            return this.movieDbApi.request('/search/tv?query={query}', 'GET', {
                query: encodeURIComponent(title)
            });
        } catch (err) {
            return {};
        }
    }

    @memoize
    async getEpisodeDetails(showId, season) {
        console.log('no cache getepisodeDetails', showId, season);

        return this.movieDbApi.request('/tv/{id}?append_to_response={append_to_response}', 'GET', {
            id: encodeURIComponent(showId),
            append_to_response: 'season/' + season
        });
    }

    getSeasonDetails(data, seasonNumber) {
        let seasonData = {};
        if (data['season/' + seasonNumber]) {
            seasonData = {
                ...data['season/' + seasonNumber],
                ...data['seasons'][seasonNumber]
            };
        }
        return seasonData;
    }
}
