import {Model} from 'backbone';
import moment from 'moment';

/**
 * @class SearchResultModel
 */
const SearchResult = Model.extend({
    defaults() {
        return {
            id: null,
            etag: null,
            kind: null,
            videoId: null,
            channelId: null,
            description: '',
            publishedAt: null,
            thumbnails: null,
            title: ''
        };
    },

    parse(response) {
        return {
            id: response.id.videoId,
            etag: response.etag,
            kind: response.id.kind,
            videoId: response.id.videoId,
            channelId: response.snippet.channelId,
            description: response.snippet.description,
            publishedAt: moment(response.snippet.publishedAt),
            thumbnails: response.snippet.thumbnails,
            title: response.snippet.title
        };
    }
});

export default SearchResult;
