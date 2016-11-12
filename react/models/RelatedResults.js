import SearchResults from './SearchResults';
import Config from '../Config';
import $ from 'jquery';

const RelatedResults = SearchResults.extend({
    url() {
        return Config.endpoints.related + '?' + $.param([
                { name: 'channelId', value: this._channelId },
                { name: 'relatedToVideoId', value: this._relatedToVideoId },
                { name: 'pageToken', value: this._nextPageToken }
            ]);
    }
});

module.exports = RelatedResults;
