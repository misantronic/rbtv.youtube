import * as Marionette from 'backbone.marionette'
import $ from 'jquery'
import {localStorage} from '../../utils'

const baseURL = 'https://www.googleapis.com/youtube/v3';

class Controller extends Marionette.Object {
    /** @returns {{state: string, access_token: string, token_type: string, expires_in: string, scope: string, client_id: string, response_type: string, issued_at: string, expires_at: string, status: {google_logged_in: boolean, signed_in: boolean, method: string}}}*/
    get data() {
        return this._data;
    }

    initialize() {
        this._data = localStorage.get('ytAccess');
    }

    /**
     *
     * @param {'like'|'dislike'|'none'} rating
     * @param videoId
     */
    addRating(rating, videoId) {
        return this._authorize([
            'https://www.googleapis.com/auth/youtubepartner',
            'https://www.googleapis.com/auth/youtube',
            'https://www.googleapis.com/auth/youtube.force-ssl'
        ]).then(() =>
            $.post(baseURL + '/videos/rate', {
                    id: videoId,
                    rating: rating
                })
                .then(() => rating)
        );
    }

    getRating(videoId) {
        if (this._data) {
            return $.get(baseURL + '/videos/getRating', { id: videoId })
                .then(result => result.items[0].rating)
        }

        return $.Deferred().resolve(null).promise();
    }

    /**
     * @param {Array} scope
     * @returns {Promise}
     * @private
     */
    _authorize(scope) {
        var Deferred = $.Deferred();

        if (this.data) {
            Deferred.resolve();
        } else {
            gapi.auth.authorize({
                'client_id': '41722713665-rmnr2sd8u0g5s2ait1el7ec36fgm50mq.apps.googleusercontent.com',
                'scope': scope
            }, () => {
                this._data = gapi.auth.getToken();

                localStorage.set('ytAccess', this._data);

                Deferred.resolve();
            });
        }

        return Deferred.promise();
    }
}

export default new Controller();