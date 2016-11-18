const moment = require('moment');
const Model = require('backbone').Model;

/**
 * @class PlaylistItemModel
 */
class PlaylistItem extends Model {

    defaults() {
        return {
            id: 0,
            etag: null,
            kind: null,
            videoId: null,
            playlistId: null,
            channelId: null,
            description: '',
            publishedAt: null,
            thumbnails: null,
            title: ''
        };
    }

    /** @param {{kind: string, etag: string, id: string, snippet: {publishedAt: string, channelId: string, title: string, description: string, thumbnails: {default: {url: string, width: number, height: number}, medium: {url: string, width: number, height: number}, high: {url: string, width: number, height: number}, standard: {url: string, width: number, height: number}, maxres: {url: string, width: number, height: number}}, channelTitle: string, playlistId: string, position: number, resourceId: {kind: string, videoId: string}}, contentDetails: {videoId: string}}} response */
    parse(response) {
        return {
            id: response.id,
            etag: response.etag,
            kind: response.kind,
            videoId: response.snippet.resourceId.videoId,
            playlistId: response.snippet.playlistId,
            channelId: response.snippet.channelId,
            description: response.snippet.description,
            publishedAt: moment(response.snippet.publishedAt),
            thumbnails: response.snippet.thumbnails,
            title: response.snippet.title
        };
    }
}

module.exports = PlaylistItem;
