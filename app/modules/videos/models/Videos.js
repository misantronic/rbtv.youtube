import $ from 'jquery'
import moment from 'moment'
import {Model, Collection} from 'backbone'
import Config from '../../../Config'

const parts      = 'snippet';
const maxResults = 50;

class Video extends Model {
    defaults() {
        return {
            id: 0,
            etag: null,
            kind: null,
            channelId: null,
            description: '',
            publishedAt: null,
            thumbnails: null,
            tags: null,
            title: ''
        }
    }

    parse(response) {
        return {
            id: response.id,
            etag: response.etag,
            kind: response.kind,
            channelId: response.snippet.channelId,
            description: response.snippet.description,
            publishedAt: moment(response.snippet.publishedAt),
            thumbnails: response.snippet.thumbnails,
            tags: response.snippet.tags,
            title: response.snippet.title
        };
    }
}

class Videos extends Collection {
    constructor(...args) {
        super(...args);

        this.model = Video;
    }

    /** @param {Array} val */
    setVideoIds(val) {
        this._videoIds = val;

        return this;
    }

    url() {
        return Config.endpoints.videos + '?' + $.param([
                { name: 'part', value: parts },
                { name: 'maxResults', value: maxResults },
                { name: 'key', value: Config.key },
                { name: 'id', value: this._videoIds.join(',') }
            ]);
    }

    parse(response) {
        return response.items;
    }
}

export default Videos