import _ from 'underscore';
import $ from 'jquery';
import Config from '../Config';
const storage = require('../utils/storage');

const baseURL = 'https://www.googleapis.com/youtube/v3';

const endpoints = {
    getRating: baseURL + '/videos/getRating',
    playlists: baseURL + '/playlists',
    rate: baseURL + '/videos/rate',
    comments: baseURL + '/comments',
    commentThreads: baseURL + '/commentThreads'
};

const authorizedEndpoints = [
    endpoints.getRating,
    endpoints.rate,
    endpoints.commentThreads,
    endpoints.comments
];

const clientId = '41722713665-rmnr2sd8u0g5s2ait1el7ec36fgm50mq.apps.googleusercontent.com';

const scope = [
    'https://www.googleapis.com/auth/youtubepartner',
    'https://www.googleapis.com/auth/youtube',
    'https://www.googleapis.com/auth/youtube.force-ssl'
];

module.exports = {
    endpoints,

    init() {
        this._data = storage.get('ytAccess');

        $(document).ajaxSend((e, xhr, options) => {
            if (!this._data) return;

            const url = options.url.split('?')[0];

            if (authorizedEndpoints.indexOf(url) !== -1) {
                xhr.setRequestHeader('Authorization', this._data.token_type + ' ' + this._data.access_token); // jshint ignore:line
            }
        });

        return this;
    },

    /**
     * @param {'like'|'dislike'|'none'} rating
     * @param videoId
     * @param {Boolean} retryOnFail
     */
    addRating(rating, videoId, retryOnFail = true) {
        return this._authorize()
            .then(() =>
                $.post(endpoints.rate, {
                    id: videoId,
                    rating
                })
                    .then(() => rating)
                    .fail(result => {
                        if (retryOnFail && result.status === 401) {
                            this._reAuthorize().then(() => {
                                this.addRating(rating, videoId, false);
                            });
                        }
                    })
            );
    },

    getRating(videoId, callback, retryOnFail = true) {
        if (this._data) {
            return $.get(endpoints.getRating, { id: videoId })
                .then(result => result.items[0].rating)
                .fail(result => {
                    if (retryOnFail && result.status === 401) {
                        this._reAuthorize().then(() => {
                            this.getRating(videoId, callback, false);
                        });
                    }
                })
                .done(callback);
        }

        return $.Deferred().resolve(null).promise();
    },

    fetchPlaylistName(playlistId) {
        return $.get(`${endpoints.playlists}?part=snippet&id=${playlistId}&maxResults=1&fields=items%2Fsnippet%2Ftitle&key=${Config.key}`)
            .then(data => data.items[0]['snippet'].title);
    },

    /**
     * @param {Comment|CommentThread} commentModel
     * @param {Function} callback
     * @param {Boolean} retryOnFail
     * @returns {Promise}
     */
    addComment(commentModel, callback, retryOnFail = true) {
        return this._authorize()
            .then(() => {
                const payload = commentModel.getPayload();

                if (this._data) {
                    return $.ajax({
                        url: commentModel.urlRoot + '?part=snippet',
                        type: 'POST',
                        dataType: 'json',
                        data: JSON.stringify(payload),
                        contentType: 'application/json'
                    })
                        .fail(result => {
                            if (retryOnFail && result.status === 401) {
                                this._reAuthorize().then(() => {
                                    this.addComment(commentModel, callback, false);
                                });
                            }
                        })
                        .done(callback);
                }
            });
    },

    /**
     * @returns {Promise}
     * @private
     */
    _authorize(immediate = false) {
        const self = this;
        const Deferred = $.Deferred();

        if (this._data) {
            Deferred.resolve();
        } else {
            if (gapi && gapi.auth && gapi.auth.authorize) {
                gapi.auth.authorize({
                    'client_id': clientId,
                    scope,
                    immediate
                }, () => {
                    this._data = gapi.auth.getToken();

                    storage.set('ytAccess', _.omit(this._data, 'g-oauth-window'));

                    Deferred.resolve();
                });
            }
        }

        return Deferred.promise();
    },

    /**
     * @returns {Promise}
     * @private
     */
    _reAuthorize() {
        this._data = null;

        return this._authorize(true);
    }
};
