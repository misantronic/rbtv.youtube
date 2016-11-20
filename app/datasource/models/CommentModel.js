const _ = require('underscore');
const moment = require('moment');
const youtubeController = require('../../utils/youtubeController');
const Model = require('backbone').Model;

module.exports = Model.extend({

    urlRoot: youtubeController.endpoints.comments,

    defaults: {
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
    },

    initialize() {
        const snippet = this._parseSnippet(this.get('snippet'));

        this.set('snippet', snippet);
    },

    parse(response) {
        response.snippet = this._parseSnippet(response.snippet);

        return response;
    },

    clone() {
        const clonedModel = Model.prototype.clone.call(this);

        // Clone snippet
        clonedModel.set('snippet', _.clone(clonedModel.get('snippet')));

        return clonedModel;
    },

    reset() {
        this.set(_.result(this, 'defaults'));
    },

    /** @returns {{snippet: {parentId: *, textOriginal: (string|*)}}} */
    getPayload() {
        const snippet = this.get('snippet');

        return {
            id: this.id,
            snippet: {
                parentId: snippet.parentId,
                textOriginal: snippet.textOriginal || snippet.textDisplay
            }
        };
    },

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
});
