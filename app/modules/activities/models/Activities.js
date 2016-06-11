import $ from 'jquery';
import moment from 'moment';
import {Model, Collection} from 'backbone';
import Config from '../../../Config';

class Activity extends Model {
    defaults() {
        return {
            id: 0,
            etag: null,
            kind: null,
            videoId: null,
            channelId: null,
            description: '',
            publishedAt: null,
            thumbnails: null,
            title: '',
            tags: null,
            duration: null
        };
    }

    parse(response) {
        return {
            id: response.id,
            etag: response.etag,
            kind: response.kind,
            videoId: response.contentDetails.upload.videoId,
            channelId: response.snippet.channelId,
            description: response.snippet.description,
            publishedAt: moment(response.snippet.publishedAt),
            thumbnails: response.snippet.thumbnails,
            title: response.snippet.title
        };
    }
}

class Activities extends Collection {
    constructor(...args) {
        super(...args);

        this.model = Activity;
    }

    setChannelId(val) {
        this._channelId = val;

        return this;
    }

    setNextPageToken(val) {
        this._nextPageToken = val;

        return this;
    }

    get nextPageToken() {
        return this._nextPageToken;
    }

    url() {
        return Config.endpoints.activities + '?' + $.param([
                { name: 'channelId', value: this._channelId },
                { name: 'pageToken', value: this._nextPageToken }
            ]);
    }

    parse(response) {
        this._nextPageToken = response.nextPageToken;

        return this.models.concat(response.items);
    }
}

export {Activities, Activity};
export default Activities;
