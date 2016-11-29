const _ = require('underscore');
const $ = require('jquery');
const moment = require('moment');
const Model = require('backbone').Model;
const Config = require('../../Config');

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
        const liveStreamingDetails = this._liveStreamingDetails || false;

        return Config.endpoints.videos + '?' + $.param([
                { name: 'id', value: this.id },
                { name: 'fromCache', value: fromCache },
                { name: 'liveStreamingDetails', value: liveStreamingDetails }
            ]);
    },

    parse(response) {
        if (_.isArray(response)) {
            response = response[0];
        }

        // add first names
        const tags = response.snippet.tags;

        _.each(tags, tag => {
            // Special cases
            if (tag.toLowerCase() === 'daniel budiman') {
                tags.push('budi');
            }

            // Special cases
            if (tag.toLowerCase() === 'eddy') {
                tags.push('etienne');
            }

            // Special cases
            if (tag.toLowerCase() === 'flo') {
                tags.push('florian');
            }

            const tagsArr = tag.split(' ');

            if (tagsArr.length > 1) {
                tags.push(tagsArr[0]);
            }
        });

        return {
            id: response.id,
            videoId: response.id,
            etag: response.etag,
            kind: response.kind,
            channelId: response.snippet.channelId,
            description: response.snippet.description,
            publishedAt: moment(response.snippet.publishedAt),
            thumbnails: response.snippet.thumbnails,
            tags,
            title: response.snippet.title,
            duration: moment.duration(response.contentDetails.duration),
            statistics: response.statistics,
            liveStreamingDetails: response.liveStreamingDetails
        };
    },

    fetch(options = { fromCache: true, liveStreamingDetails: false }) {
        this._fromCache = options.fromCache;
        this._liveStreamingDetails = options.liveStreamingDetails;

        return Model.prototype.fetch.call(this, options);
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

module.exports = Video;
