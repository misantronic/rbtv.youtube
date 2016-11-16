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
        const id = response.contentDetails ? response.contentDetails.upload.videoId : response.id.videoId;
        const kind = response.kind || response.id.kind;

        return {
            id,
            kind,
            videoId : id,
            etag: response.etag,
            channelId: response.snippet.channelId,
            description: response.snippet.description,
            publishedAt: moment(response.snippet.publishedAt),
            thumbnails: response.snippet.thumbnails,
            title: response.snippet.title
        };
    }
});

module.exports = SearchResult;
