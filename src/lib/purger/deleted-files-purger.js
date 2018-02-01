import fsUtils from '../fs-util';

export default class DeletedFilesPurger {
    constructor(episodeService, seasonService, showService, movieService, logger) {
        this.episodeService = episodeService;
        this.seasonService = seasonService;
        this.showService = showService;
        this.movieService = movieService;
        this.logger = logger;
    }

    async execute(library) {
        await this.purgeEpisodes(library);
        await this.purgeMovies(library);
    }

    async purgeEpisodes(library) {
        const allEpisodes = await this.episodeService.find({ library_uid: library });
        const episodtesToDelete = [];
        const potentiallyEmptySeasons = {};
        const potentiallyEmptyShows = {};

        for (let index in allEpisodes) {
            const episode = allEpisodes[index];
            const doFileExists = await fsUtils.fileExists(episode.filePath);

            if (!doFileExists) episodtesToDelete.push(episode);
        }

        this.logger.info('Removing obsolete episodes');
        for (let index in episodtesToDelete) {
            const episode = episodtesToDelete[index];
            this.logger.info('Deleting episode [' + episode.filePath + ']');
            potentiallyEmptySeasons[episode.season_uid] = true;
            await this.episodeService.remove(episode.uid);
        }

        this.logger.info('Removing obsolete seasons');
        for (let seasonUid in potentiallyEmptySeasons) {
            const season = await this.seasonService.get(seasonUid);
            const episodesInSeason = await this.episodeService.find({ season_uid: seasonUid, library_uid: library });
            if (episodesInSeason.length === 0) {
                potentiallyEmptyShows[season.show_uid] = true;
                await this.seasonService.remove(season.uid);
            }
        }

        this.logger.info('Removing obsolete shows');
        for (let showUid in potentiallyEmptyShows) {
            const show = await this.showService.get(showUid);
            const episodesInShow = await this.episodeService.find({ show_uid: showUid, library_uid: library });
            if (episodesInShow.length === 0) {
                await this.showService.remove(show.uid);
            }
        }
    }

    async purgeMovies() {
        const allMovies = await this.movieService.find({});
        const moviesToDelete = [];

        for (let index in allMovies) {
            const movie = allMovies[index];
            const doFileExists = await fsUtils.fileExists(movie.filePath);

            if (!doFileExists) moviesToDelete.push(movie);
        }

        this.logger.info('Removing obsolete movies');
        for (let index in moviesToDelete) {
            const movie = moviesToDelete[index];
            this.logger.info('Deleting movie [' + movie.filePath + ']');
            await this.movieService.remove(movie.uid);
        }
    }
}
