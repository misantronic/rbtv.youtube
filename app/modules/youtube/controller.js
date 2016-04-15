import * as Marionette from 'backbone.marionette'
import _ from 'underscore'
import $ from 'jquery'
import {localStorage} from '../../utils'
import Config from '../../Config'

const baseURL = 'https://www.googleapis.com/youtube/v3';

const endpoints = {
    getRating: baseURL + '/videos/getRating',
    playlists: baseURL + '/playlists',
    rate: baseURL + '/videos/rate',
    commentThreads: baseURL + '/commentThreads'
};

const authorizedEndpoints = [
    endpoints.getRating,
    endpoints.rate,
    endpoints.commentThreads
];

const clientId = '41722713665-rmnr2sd8u0g5s2ait1el7ec36fgm50mq.apps.googleusercontent.com';

const scope = [
    'https://www.googleapis.com/auth/youtubepartner',
    'https://www.googleapis.com/auth/youtube',
    'https://www.googleapis.com/auth/youtube.force-ssl'
];

class Controller extends Marionette.Object {
    /** @returns {{state: string, access_token: string, token_type: string, expires_in: string, scope: string, client_id: string, response_type: string, issued_at: string, expires_at: string, status: {google_logged_in: boolean, signed_in: boolean, method: string}}}*/
    get data() {
        return this._data;
    }

    initialize() {
        this._data = localStorage.get('ytAccess');
    }

    init() {
        $(document).ajaxSend((e, xhr, options) => {
            if (!this.data) return;

            const url = options.url.split('?')[0];

            if (authorizedEndpoints.indexOf(url) !== -1) {
                xhr.setRequestHeader('Authorization', this.data.token_type + ' ' + this.data.access_token); // jshint ignore:line
            }
        });
    }

    /**
     * @param {'like'|'dislike'|'none'} rating
     * @param videoId
     */
    addRating(rating, videoId) {
        return this._authorize()
            .then(() =>
                $.post(endpoints.rate, {
                        id: videoId,
                        rating: rating
                    })
                    .then(() => rating)
            );
    }

    getRating(videoId, callback, retryOnFail = true) {
        if (this.data) {
            return $.get(endpoints.getRating, { id: videoId })
                .then(result => result.items[0].rating)
                .fail(result => {
                    if (retryOnFail && result.status === 401) {
                        this._reAuthorize().then(() => {
                            this.getRating(videoId, callback, false);
                        })
                    }
                })
                .done(callback);
        }

        return $.Deferred().resolve(null).promise();
    }

    fetchPlaylistName(playlistId) {
        return $.get(`${endpoints.playlists}?part=snippet&id=${playlistId}&maxResults=1&fields=items%2Fsnippet%2Ftitle&key=${Config.key}`)
            .then(data => {
                return data.items[0]['snippet'].title
            });
    }

    /**
     * @param {Comment} commentModel
     * @param {Function} callback
     * @param {Boolean} retryOnFail
     * @returns {Promise}
     */
    addComment(commentModel, callback, retryOnFail = true) {
        return this._authorize()
            .then(() => {
                let snippet = commentModel.get('snippet');

                let payload = {
                    snippet: {
                        channelId: snippet.channelId,
                        videoId: snippet.videoId,
                        topLevelComment: {
                            snippet: {
                                textOriginal: snippet.topLevelComment.snippet.textOriginal
                            }
                        }
                    }
                };

                if (this.data) {
                    return $.ajax({
                            url: endpoints.commentThreads +'?part=snippet',
                            type: 'POST',
                            dataType: 'json',
                            data: JSON.stringify(payload),
                            contentType: "application/json"
                        })
                        .fail(result => {
                            if (retryOnFail && result.status === 401) {
                                this._reAuthorize().then(() => {
                                    this.addComment(commentModel, callback, false);
                                })
                            }
                        })
                        .done(callback);
                }
            });
    }

    /**
     * @returns {Promise}
     * @private
     */
    _authorize(immediate = false) {
        var Deferred = $.Deferred();

        if (this.data) {
            Deferred.resolve();
        } else {
            gapi.auth.authorize({
                'client_id': clientId,
                'scope': scope,
                'immediate': immediate
            }, () => {
                this._data = gapi.auth.getToken();

                localStorage.set('ytAccess', _.omit(this._data, 'g-oauth-window'));

                Deferred.resolve();
            });
        }

        return Deferred.promise();
    }

    /**
     * @returns {Promise}
     * @private
     */
    _reAuthorize() {
        this._data = null;

        return this._authorize(true);
    }
}

export default new Controller();