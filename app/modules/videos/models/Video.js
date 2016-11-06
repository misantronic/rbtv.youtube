import _ from 'underscore';
import $ from 'jquery';
import moment from 'moment';
import {Model} from 'backbone';
import Config from '../../../Config';

const Video = Model.extend({
    defaults() {
        return {
            id: 0,
            videoId: 0,
            etag: null,
            kind: null,
            channelId: null,
            description: '',
            publishedAt: null,
            thumbnails: {
                default: {
                    width: 0,
                    heiht: 0,
                    url: ''
                },
                medium: {
                    width: 0,
                    heiht: 0,
                    url: ''
                },
                high: {
                    width: 0,
                    heiht: 0,
                    url: ''
                },
                standard: {
                    width: 0,
                    heiht: 0,
                    url: ''
                },
                maxres: {
                    width: 0,
                    heiht: 0,
                    url: ''
                }
            },
            tags: [],
            title: '',
            statistics: {
                viewCount: 0,
                likeCount: 0,
                dislikeCount: 0,
                favoriteCount: 0,
                commentCount: 0
            }
        };
    },

    url() {
        if (!this.id) {
            throw new Error('Please specify an id for this model');
        }

        const fromCache = _.isUndefined(this._fromCache) ? true : this._fromCache;

        return Config.endpoints.videos + '?' + $.param([
                { name: 'id', value: this.id },
                { name: 'fromCache', value: fromCache }
            ]);
    },

    parse(response) {
        if (_.isArray(response)) {
            response = response[0];
        }

        return {
            id: response.id,
            videoId: response.id,
            etag: response.etag,
            kind: response.kind,
            channelId: response.snippet.channelId,
            description: response.snippet.description,
            publishedAt: moment(response.snippet.publishedAt),
            thumbnails: response.snippet.thumbnails,
            tags: response.snippet.tags,
            title: response.snippet.title,
            duration: moment.duration(response.contentDetails.duration),
            statistics: response.statistics
        };
    },

    fetchLive() {
        this._fromCache = false;

        return this.fetch().then(() => {
            this._fromCache = true;
        });
    }
});

/**
 * @param {moment.duration} duration
 * @returns {String}
 */
Video.humanizeDuration = function (duration) {
    if (!duration) {
        return '';
    }

    const hours = ('0' + duration.hours()).slice(-2);
    const mins = ('0' + duration.minutes()).slice(-2);
    const secs = ('0' + duration.seconds()).slice(-2);

    // Add minutes + seconds
    const arr = [
        mins,
        secs
    ];

    // Add hours
    if (hours !== '00') arr.unshift(hours);

    return arr.join(':');
};

export default Video;
