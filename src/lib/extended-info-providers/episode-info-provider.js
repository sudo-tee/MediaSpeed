import BaseInfoProvider from './base-info-provider';

export default class EpisodeInfoProvider extends BaseInfoProvider {
    // @todo dynamic providers
    constructor(episodeFilenameInfoProvider, episodeTmdbInfoProvider) {
        super();
        this.episodeFilenameInfoProvider = episodeFilenameInfoProvider;
        this.episodeTmdbInfoProvider = episodeTmdbInfoProvider;
    }

    async execute(filename, library) {
        const episode = {
            episode: super.execute(filename, library),
            show: { library_uid: library.uid },
            season: { library_uid: library.uid }
        };

        return this.episodeFilenameInfoProvider
            .execute(episode, library)
            .then(episode => this.episodeTmdbInfoProvider.execute(episode));
    }
}
