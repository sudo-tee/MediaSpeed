import path from 'path';
import shorthash from 'shorthash';
import BaseScanner from './base-scanner';
import EventsEnum from '../events-enum';

export default class EpisodeScanner extends BaseScanner {
    constructor(episodeNameExtractor, episodeService, showService, seasonService, eventEmitter) {
        super();
        this.episodeNameExtractor = episodeNameExtractor;
        this.episodeService = episodeService;
        this.showService = showService;
        this.seasonService = seasonService;
        this.eventEmitter = eventEmitter;
    }

    async execute(filename, library) {
        // @todo From constructor
        const currentEpisode = super.execute(filename, library);
        const episodeInfo = this.episodeNameExtractor.extract(currentEpisode.fileName);

        if (episodeInfo._score === 0) {
            console.log('Cannot parse', filename);
            return;
        }

        const showName = episodeInfo.series.replace(/ +(?= )/g, '');
        const seasonNumber = episodeInfo.season || 1;
        const seasonUid = shorthash.unique(path.dirname(currentEpisode.filePath) + seasonNumber);
        const showUid = shorthash.unique(
            EpisodeScanner.getShowFolder(currentEpisode.filePath, library.path) + showName
        );

        let episode = {
            ...currentEpisode,
            ...{
                season_uid: seasonUid,
                show_uid: showUid,
                type: 'episode',
                show_name: showName,
                episode_number: episodeInfo.episode,
                season_number: seasonNumber,
                name: episodeInfo.title || 'Episode ' + episodeInfo.episode
            }
        };

        let show = {
            library_uid: library.uid,
            uid: showUid,
            type: 'show',
            name: showName
        };

        let season = {
            uid: seasonUid,
            type: 'season',
            season_number: seasonNumber,
            show_uid: showUid
        };

        episode = await this.createEpisode(episode);
        season = await this.createSeason(season);
        show = await this.createShow(show);

        this.eventEmitter.emit(EventsEnum.EPISODE_CREATED, episode, season, show);
    }

    async createEpisode(episode) {
        let alreadyExist = await this.episodeService.tryGet(episode.uid);
        if (alreadyExist) return episode;

        return this.episodeService.create(episode);
    }

    async createShow(show) {
        let alreadyExist = await this.showService.tryGet(show.uid);
        if (alreadyExist) return show;

        this.eventEmitter.emit(EventsEnum.SHOW_CREATED, show);
        return this.showService.create(show);
    }

    async createSeason(season) {
        let alreadyExist = await this.seasonService.tryGet(season.uid);
        if (alreadyExist) return season;

        this.eventEmitter.emit(EventsEnum.SEASON_CREATED, season);
        return this.seasonService.create(season);
    }

    static getShowFolder(episodeFilePath, libraryRoot) {
        let showFolder = path.dirname(path.dirname(episodeFilePath));

        if (showFolder.length < libraryRoot.length) {
            return libraryRoot;
        }

        return showFolder;
    }
}
