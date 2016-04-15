import {Model, Collection} from 'backbone'
import {props} from '../../decorators'
import Config from '../../../Config'
import moment from 'moment';

class CommentThread extends Model {
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

        _.extend(snippet, snippet.topLevelComment.snippet);

        snippet = this._parseDate(snippet);
    }

    parse(response) {
        _.extend(response.snippet, response.snippet.topLevelComment.snippet);

        this._parseDate(response.snippet);

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

class CommentThreads extends Collection {
    @props({
        model: CommentThread,

        url: function () {
            return `${Config.endpoints.commentThreads}?videoId=${this._videoId}&pageToken=${this._pageToken}`;
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

export {CommentThread, CommentThreads}
export default CommentThreads