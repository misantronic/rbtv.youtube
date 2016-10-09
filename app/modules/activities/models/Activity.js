import moment from 'moment';
import {Model} from 'backbone';

const Activity = Model.extend({
    defaults: {
        id: 0,
        etag: null,
        kind: null,
        videoId: null,
        channelId: null,
        description: '',
        publishedAt: null,
        thumbnails: null,
        title: '',
        tags: null,
        duration: null
    },

    parse(response) {
        return {
            id: response.id,
            etag: response.etag,
            kind: response.kind,
            videoId: response.contentDetails.upload.videoId,
            channelId: response.snippet.channelId,
            description: response.snippet.description,
            publishedAt: moment(response.snippet.publishedAt),
            thumbnails: response.snippet.thumbnails,
            title: response.snippet.title
        };
    }
});

export default Activity;
