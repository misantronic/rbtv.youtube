const moment = require('moment');
const Model = require('backbone').Model;

const Playlist = Model.extend({
    defaults() {
        return {
            id: 0,
            etag: null,
            kind: null,
            itemCount: 0,
            channelId: null,
            description: '',
            publishedAt: null,
            thumbnails: null,
            title: ''
        };
    },

    /** @param {{kind: string, etag: string, id: string, snippet: {publishedAt: string, channelId: string, title: string, description: string, thumbnails: {default: {url: string, width: number, height: number}, medium: {url: string, width: number, height: number}, high: {url: string, width: number, height: number}, standard: {url: string, width: number, height: number}, maxres: {url: string, width: number, height: number}}, channelTitle: string, localized: {title: string, description: string}}, contentDetails: {itemCount: number}}} response      */
    parse(response) {
        return {
            id: response.id,
            etag: response.etag,
            kind: response.kind,
            itemCount: response.contentDetails.itemCount,
            channelId: response.snippet.channelId,
            description: response.snippet.description,
            publishedAt: moment(response.snippet.publishedAt),
            thumbnails: response.snippet.thumbnails,
            title: response.snippet.title
        };
    }
});

module.exports = Playlist;
