import path from 'path';
import shorthash from 'shorthash';

export default class EpisodeFilenameInfoProvider {
    constructor(episodeNameExtractor) {
        this.episodeNameExtractor = episodeNameExtractor;
    }

    async execute(episode, library) {
        const episodeInfo = this.episodeNameExtractor.extract(episode.episode.fileName);

        const showName = episodeInfo.series.replace(/ +(?= )/g, '');
        const seasonNumber = episodeInfo.season || 1;
        const seasonUid = shorthash.unique(path.dirname(episode.episode.filePath) + seasonNumber);
        const showUid = shorthash.unique(
            EpisodeFilenameInfoProvider.getShowFolder(episode.episode.filePath, library.path) + showName
        );

        return {
            episode: {
                ...episode.episode,
                ...{
                    season_uid: seasonUid,
                    show_uid: showUid,
                    type: 'episode',
                    show_name: showName,
                    episode_number: episodeInfo.episode,
                    season_number: seasonNumber,
                    name: episodeInfo.title
                }
            },
            show: {
                ...episode.show,
                ...{
                    uid: showUid,
                    type: 'show',
                    name: showName
                }
            },
            season: {
                ...episode.season,
                ...{
                    uid: seasonUid,
                    type: 'season',
                    season_number: episodeInfo.season || 1
                }
            }
        };
    }

    static getShowFolder(episodeFilePath, libraryRoot) {
        let showFolder = path.dirname(path.dirname(episodeFilePath));

        if (showFolder.length < libraryRoot.length) {
            return libraryRoot;
        }

        return showFolder;
    }
}
