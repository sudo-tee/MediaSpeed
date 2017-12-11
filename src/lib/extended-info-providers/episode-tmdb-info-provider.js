import memoize from 'memoized-decorator';
import { pick } from 'lodash';
import EventsEnum from '../events-enum';

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
    constructor(movieDbApi, eventEmitter, episodeService, showService, seasonService, logger) {
        this.movieDbApi = movieDbApi;
        this.eventEmitter = eventEmitter;
        this.episodeService = episodeService;
        this.showService = showService;
        this.seasonService = seasonService;
        this.logger = logger;

        this.eventEmitter.on(EventsEnum.EPISODE_CREATED, (episode, season, show) =>
            this.execute(episode, season, show)
        );
    }

    async execute(episode, season, show) {
        const episodeInfo = await this.updateExtendedInfo(episode, season, show);

        return { ...episode, ...episodeInfo };
    }

    async updateExtendedInfo(episode, season, show) {
        try {
            let searchDetails = await this.searchEpisode(episode.show_name);
            const showDetails = await this.getEpisodeDetails(searchDetails.id, episode.season_number);
            const seasonDetails = this.getSeasonDetails(showDetails, episode.season_number);
            const episodeDetails = seasonDetails['episodes'][episode.episode_number - 1];

            episode = {
                ...episode,
                ...pick(episodeDetails, episodeFields),
                ...{ tmdb_id: episodeDetails.id }
            };

            show = {
                ...show,
                ...pick(showDetails, showFields),
                ...{ tmdb_id: showDetails.id }
            };

            season = {
                ...season,
                ...pick(seasonDetails, seasonFields),
                ...{ tmdb_id: seasonDetails.id }
            };

            this.episodeService.update(episode.uid, episode);
            this.showService.update(show.uid, show);
            this.seasonService.update(season.uid, season);
        } catch (err) {
            this.logger.debug(err);
            return episode;
        }
    }

    @memoize
    async searchEpisode(title) {
        this.logger.debug('no cache searchEpisode', title);

        return this.movieDbApi.searchTv({
            query: title
        });
    }

    @memoize
    async getEpisodeDetails(showId, season) {
        this.logger.debug('no cache getEpisodeDetails', showId, season);

        return this.movieDbApi.tvInfo({
            id: showId,
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
