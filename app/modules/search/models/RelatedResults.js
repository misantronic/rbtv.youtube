import {SearchResults} from './SearchResults'
import Config from '../../../Config'
import $ from 'jquery'

class RelatedResults extends SearchResults {

    url() {
        return Config.endpoints.related + '?' + $.param([
                { name: 'channelId', value: this._channelId },
                { name: 'relatedToVideoId', value: this._relatedToVideoId },
                { name: 'pageToken', value: this._nextPageToken }
            ]);
    }
}

export default RelatedResults