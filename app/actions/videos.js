import moment from 'moment';
import _ from 'underscore';
import axios from 'axios';
import storage from '../utils/storage';
import Config from '../Config';

const parseVideos = function (items) {
    return _.map(items, item => {
        if (_.isArray(item)) {
            item = item[0];
        }

        // Get videoInfo from localStorage
        const videoInfo = storage.getVideoInfo(item.id);

        // add first names
        const tags = item.snippet.tags;

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
            id: item.id,
            videoId: item.id,
            etag: item.etag,
            kind: item.kind,
            channelId: item.snippet.channelId,
            description: item.snippet.description,
            publishedAt: moment(item.snippet.publishedAt),
            thumbnails: item.snippet.thumbnails,
            tags,
            videoInfo,
            title: item.snippet.title,
            duration: moment.duration(item.contentDetails.duration),
            statistics: item.statistics,
            liveStreamingDetails: item.liveStreamingDetails
        };
    });
};

export function fetchVideos(videoIds) {
    return function (dispatch) {
        if (videoIds.length === 0) return;

        dispatch({ type: fetchVideos.PENDING });

        axios
            .get(Config.endpoints.videos, {
                params: {
                    id: videoIds.join(',')
                }
            })
            .then(res => {
                const items = parseVideos(res.data);

                dispatch({
                    type: fetchVideos.FULFILLED,
                    items
                });
            })
            .catch(error => {
                dispatch({
                    type: fetchVideos.REJECTED,
                    error
                });
            });
    };
}

fetchVideos.PENDING = 'FETCH_VIDEOS_PENDING';
fetchVideos.FULFILLED = 'FETCH_VIDEOS_FULFILLED';
fetchVideos.REJECTED = 'FETCH_VIDEOS_REJECTED';
