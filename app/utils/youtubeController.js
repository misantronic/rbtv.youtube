import _ from 'underscore';
import $ from 'jquery';
import Config from '../Config';
import storage from '../utils/storage';

const ytBaseURL = 'https://www.googleapis.com/youtube/v3';
const calBaseURL = 'https://www.googleapis.com/calendar/v3';

const endpoints = {
    getRating: ytBaseURL + '/videos/getRating',
    playlists: ytBaseURL + '/playlists',
    rate: ytBaseURL + '/videos/rate',
    comments: ytBaseURL + '/comments',
    commentThreads: ytBaseURL + '/commentThreads',
    channels: ytBaseURL + '/channels',
    calendar: calBaseURL + '/calendars'
};

const authorizedEndpoints = [
    endpoints.getRating,
    endpoints.rate,
    endpoints.commentThreads,
    endpoints.comments,
    endpoints.channels
];

const clientId = '41722713665-rmnr2sd8u0g5s2ait1el7ec36fgm50mq.apps.googleusercontent.com';

const scope = [
    'https://www.googleapis.com/auth/youtube.force-ssl',
    'https://www.googleapis.com/auth/youtube.readonly'
    // 'https://www.googleapis.com/auth/youtubepartner',
    // 'https://www.googleapis.com/auth/youtube',
    // 'https://www.googleapis.com/auth/youtubepartner-channel-audit'
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
     */
    addRating(rating, videoId) {
        const url = endpoints.rate + '?id=' + videoId + '&rating=' + rating;

        return this._request(url, 'POST')
            .then(() => rating);
    },

    getRating(videoId) {
        const url = `${endpoints.getRating}?id=${videoId}`;
        const xhr = this._request(url);

        xhr.then(data => data.items[0].rating);

        return xhr;
    },

    getChannelInfo() {
        const url = `${this.endpoints.channels}?part=id&mine=true&maxResults=1&key=${Config.key}`;

        return this._request(url, 'GET')
            .then(data => {
                const myChannelInfo = data.items[0];

                storage.set('ytMyChannel', myChannelInfo);

                return myChannelInfo;
            });
    },

    /**
     * @param {CommentModel|CommentThreadModel} commentModel
     * @returns {Promise}
     */
    addComment(commentModel) {
        const url = commentModel.urlRoot + '?part=snippet';
        const data = commentModel.getPayload();

        return this._request(url, 'POST', data);
    },

    /**
     * @param {CommentModel|CommentThreadModel} commentModel
     * @returns {Promise}
     */
    updateComment(commentModel) {
        const url = endpoints.comments + '?part=snippet';
        const data = commentModel.getPayload();

        return this._request(url, 'PUT', data);
    },

    /**
     * @param {CommentModel|CommentThreadModel} commentModel
     * @returns {Promise}
     */
    removeComment(commentModel) {
        const url = endpoints.comments + '?id=' + commentModel.id;

        return this._request(url, 'DELETE');
    },

    invalidateComments(key) {
        const url = `${Config.endpoints.cacheInvalidate}/?key=${key}`;

        return this._request(url);
    },

    /**
     * Private methods
     */

    /**
     *
     * @param {String} url
     * @param {'GET'|'PUT'|'POST'|'DELETE'} [type]
     * @param {Object} [data]
     * @private
     */
    _request(url, type = 'GET', data = null) {
        const self = this;

        const fn = function (retryOnFail = true) {
            return self._authorize().then(() => {
                if (self._data) {
                    const xhr = $.ajax({
                        url,
                        type,
                        data: data ? JSON.stringify(data) : null,
                        dataType: 'json',
                        contentType: 'application/json'
                    });

                    xhr.fail(result => {
                        if (retryOnFail && result.status === 401) {
                            self._reAuthorize().then(() => {
                                return fn(false);
                            });
                        }
                    });

                    return xhr;
                }
            });
        };

        return fn();
    },

    /**
     * @returns {Promise}
     * @private
     */
    _authorize(immediate = false) {
        const Deferred = $.Deferred();

        if (this._data) {
            Deferred.resolve();
        } else {
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
