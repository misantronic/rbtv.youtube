import moment from 'moment';
import {Model, Collection} from 'backbone'
import {props} from '../../decorators'
import Config from '../../../Config'
import youtubeController from '../../youtube/controller'

class Comment extends Model {
    @props({
        urlRoot: youtubeController.endpoints.comments
    })

    defaults() {
        return {
            kind: null,
            etag: null,
            id: null,
            snippet: {
                videoId: null,
                channelId: null,
                canReply: null,
                totalReplyCount: null,
                isPublic: null,
                authorDisplayName: null,
                authorProfileImageUrl: null,
                authorChannelUrl: null,
                authorChannelId: {
                    value: null
                },
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
        let snippet = this._parseSnippet(this.get('snippet'));

        this.set('snippet', snippet);
    }

    parse(response) {
        response.snippet = this._parseSnippet(response.snippet);

        return response;
    }

    reset() {
        this.set(_.result(this, 'defaults'));
    }

    /** @returns {{snippet: {parentId: *, textOriginal: (string|*)}}} */
    getPayload() {
        let snippet = this.get('snippet');

        return {
            snippet: {
                parentId: snippet.parentId,
                textOriginal: snippet.textOriginal
            }
        };
    }

    _parseSnippet(snippet) {
        if (snippet.topLevelComment) {
            _.extend(snippet, snippet.topLevelComment.snippet);

            snippet = _.omit(snippet, 'topLevelComment');
        }

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