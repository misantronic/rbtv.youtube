import $ from 'jquery'
import _ from 'underscore'
import moment from 'moment'
import {Model, Collection} from 'backbone'
import Config from '../../../Config'
import {props} from '../../decorators'

const parts = 'snippet';
const maxResults = 50;

class Video extends Model {
    defaults() {
        return {
            id: 0,
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
        }
    }

    url() {
        if (!this.id) {
            throw new Error('Please specify an id for this model');
        }

        return Config.endpoints.videos + '?' + $.param([
                { name: 'id', value: this.id }
            ]);
    }

    parse(response) {
        if (_.isArray(response)) {
            response = response[0];
        }

        return {
            id: response.id,
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
    }

    /**
     * @param {moment.duration} duration
     * @returns {String}
     */
    static humanizeDuration(duration) {
        if (!duration) {
            return '';
        }

        let hours = ('0' + duration.hours()).slice(-2);
        let mins  = ('0' + duration.minutes()).slice(-2);
        let secs  = ('0' + duration.seconds()).slice(-2);

        // Add minutes + seconds
        var arr = [
            mins,
            secs
        ];

        // Add hours
        if (hours !== '00') arr.unshift(hours);

        return arr.join(':');
    }
}

class Videos extends Collection {
    @props({
        model: Video
    })

    /**
     * @param {Array} val
     * @returns {Videos}
     */
    setVideoIds(val) {
        this._videoIds = val;

        return this;
    }

    url() {
        return Config.endpoints.videos + '?' + $.param([
                { name: 'id', value: this._videoIds.join(',') }
            ]);
    }

    initialize() {
        this.setVideoIds([]);
    }
}

export {Video, Videos}
export default Videos