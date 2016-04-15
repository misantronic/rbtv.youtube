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
                videoId: null,
                channelId: null,
                topLevelComment: {
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
                },
                canReply: null,
                totalReplyCount: null,
                isPublic: null
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
        if (snippet.topLevelComment.snippet.publishedAt) {
            snippet.topLevelComment.snippet.publishedAt = moment(snippet.topLevelComment.snippet.publishedAt);
        }

        if (snippet.topLevelComment.snippet.updatedAt) {
            snippet.topLevelComment.snippet.updatedAt = moment(snippet.topLevelComment.snippet.updatedAt);
        }

        return snippet;
    }
}

class Comments extends Collection {
    @props({
        model: Comment,

        url: function () {
            return `${Config.endpoints.comments}?videoId=${this._videoId}&pageToken=${this._pageToken}`;
        },

        _pageToken: '',

        _videoId: ''
    })

    set videoId(val) {
        this._videoId = val;
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