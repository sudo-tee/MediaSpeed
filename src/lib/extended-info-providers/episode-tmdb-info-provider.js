import memoize from 'memoized-decorator';
import EventsEnum from '../events-enum';

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
                ...{
                    tmdb_id: episodeDetails.id,
                    tmdb_still_path: episodeDetails.still_path,
                    tmdb_show_id: showDetails.id,
                    tmdb_season_id: seasonDetails.id,
                    episode_number: episodeDetails.episode_number,
                    season_number: episodeDetails.season_number,
                    name: episodeDetails.name,
                    air_date: episodeDetails.air_date,
                    crew: episodeDetails.crew,
                    guest_stars: episodeDetails.guest_stars,
                    overview: episodeDetails.overview,
                    vote_average: episodeDetails.vote_average,
                    vote_count: episodeDetails.vote_count
                }
            };

            show = {
                ...show,
                ...{
                    tmdb_id: showDetails.id,
                    tmdb_backdrop_path: showDetails.backdrop_path,
                    tmdb_poster_path: showDetails.poster_path,
                    created_by: showDetails.created_by,
                    first_air_date: showDetails.first_air_date,
                    genres: showDetails.genres,
                    homepage: showDetails.homepage,
                    in_production: showDetails.in_production,
                    languages: showDetails.languages,
                    last_air_date: showDetails.last_air_date,
                    name: showDetails.name,
                    networks: showDetails.networks,
                    origin_country: showDetails.origin_country,
                    original_language: showDetails.original_language,
                    original_name: showDetails.original_name,
                    overview: showDetails.overview,
                    popularity: showDetails.popularity,
                    poster_path: showDetails.poster_path,
                    production_companies: showDetails.production_companies,
                    status: showDetails.status,
                    vote_average: showDetails.vote_average,
                    vote_count: showDetails.vote_count
                }
            };

            season = {
                ...season,
                ...{
                    tmdb_id: seasonDetails.id,
                    tmdb_backdrop_path: seasonDetails.backdrop_path,
                    tmdb_poster_path: seasonDetails.poster_path,
                    season_number: seasonDetails.season_number,
                    air_date: seasonDetails.air_date,
                    name: seasonDetails.name,
                    overview: seasonDetails.overview
                }
            };
            await this.episodeService.update(episode.uid, episode);
            await this.showService.update(show.uid, show);
            await this.seasonService.update(season.uid, season);

            this.eventEmitter.emit(EventsEnum.TMDB_INFO_UPDATED, episode);
            this.eventEmitter.emit(EventsEnum.TMDB_INFO_UPDATED, show);
            this.eventEmitter.emit(EventsEnum.TMDB_INFO_UPDATED, season);
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
