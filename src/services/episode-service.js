import { BadRequest } from 'fejl'
import BaseService from './base-service'

// Prevent overposting.
const props = [
  'type',
  'uid',
  'library_uid',
  'filePath',
  'fileName',
  'show_name',
  'episode_number',
  'season_number',
  'name',
  'tmdb_show_id',
  'id',
  'overview',
  'vote_average',
  'vote_count',
  'show_uid',
  'season_uid'
]

export default class EpisodeService extends BaseService {
  constructor(episodeStore) {
    super(episodeStore, props)
  }

  async assertInput(data) {
    BadRequest.assert(data, 'No todo payload given')
    BadRequest.assert(data.uid, 'uid is required')
    BadRequest.assert(data.name, 'name is required')
    BadRequest.assert(data.filePath, 'filepath is required')
    BadRequest.assert(data.fileName, 'filename does not exist')
    BadRequest.assert(data.episode_number, 'episode_number does not exist')
    BadRequest.assert(data.season_number, 'season_number does not exist')
  }
}
