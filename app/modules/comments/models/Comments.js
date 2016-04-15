import {Model, Collection} from 'backbone'
import {props} from '../../decorators'
import Config from '../../../Config'
import moment from 'moment';

class Comment extends Model {
    defaults() {
        return {
            kind: null,
            etag: null,
            id: null,
            snippet: {
                authorDisplayName: null,
                authorProfileImageUrl: null,
                authorChannelUrl: null,
                authorChannelId: {
                    value: null
                },
                videoId: null,
                textDisplay: '',
                textOriginal: '',
                authorGoogleplusProfileUrl: null,
                canRate: null,
                viewerRating: null,
                likeCount: null,
                publishedAt: null,
                updatedAt: null
            }
        }
    }

    initialize() {
        let snippet = this.get('snippet');

        snippet = this._parseDate(snippet);
    }

    parse(response) {
        let snippet = response.snippet;

        snippet = this._parseDate(snippet);

        return response;
    }

    reset() {
        this.set(_.result(this, 'defaults'));
    }

    _parseDate(snippet) {
        if (snippet.publishedAt) {
            snippet.publishedAt = moment(snippet.publishedAt);
        }

        if (snippet.updatedAt) {
            snippet.updatedAt = moment(snippet.updatedAt);
        }

        return snippet;
    }
}

class Comments extends Collection {
    @props({
        model: Comment,

        url: function () {
            return `${Config.endpoints.comments}?parentId=${this._parentId}&pageToken=${this._pageToken}`;
        },

        _pageToken: '',

        _videoId: ''
    })

    set parentId(val) {
        this._parentId = val;
    }

    get pageToken() {
        return this._pageToken
    }

    parse(response) {
        this._pageToken = response.nextPageToken || null;

        return this.models.concat(response.items);
    }
}

export {Comment, Comments}
export default Comments