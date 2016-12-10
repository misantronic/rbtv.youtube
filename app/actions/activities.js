import {fetchVideos} from './videos';

import _ from 'underscore';
import moment from 'moment';
import axios from 'axios';
import Config from '../Config';
import storage from '../utils/storage';
import store from '../store';

const parseActivities = function (items) {
    return items.map(item => {
        item.videoId = item.contentDetails ? item.contentDetails.upload.videoId : item.id.videoId;
        item.snippet.publishedAt = moment(item.snippet.publishedAt);

        if (_.isObject(item.id)) {
            item.id = item.videoId;
        }

        return item;
    });
};

export function fetchActivities(channelId, q = '', nextPageToken = '') {
    const endpoint = q ? Config.endpoints.search : Config.endpoints.activities;

    const params = {
        q,
        pageToken: nextPageToken,
        channelId
    };

    const stateItems = store.getState().activities.items;

    return function (dispatch) {
        dispatch({ type: fetchActivities.PENDING });

        axios
            .get(endpoint, { params })
            .then(res => {
                const data = res.data;
                let items = parseActivities(data.items);
                const videoIds = items.map(item => item.videoId);

                items = (nextPageToken === '' ? [] : stateItems).concat(items);

                dispatch({
                    type: fetchActivities.FULFILLED,
                    nextPageToken: data.nextPageToken,
                    items,
                    q
                });

                dispatch(fetchVideos(videoIds));
            })
            .catch(error => {
                dispatch({
                    type: fetchActivities.REJECTED,
                    error
                });
            });
    };
}

export function resetActivities() {
    return function (dispatch) {
        dispatch({
            type: resetActivities.RESET,
            items: [],
            nextPageToken: ''
        });
    };
}

export function filterActivities(channelId, q = '') {
    return function (dispatch) {
        storage.update('activities.filter', {
            q,
            channelId
        });

        dispatch({
            type: filterActivities.FILTER,
            channelId,
            q,
            nextPageToken: ''
        });
    };
}

export function fetchAutocomplete() {
    const autocomplete = [].concat(require('../datasource/beans'), require('../datasource/shows'));

    return function (dispatch) {
        dispatch({
            type: fetchAutocomplete.FETCH,
            autocomplete
        });
    };
}

fetchActivities.PENDING = 'FETCH_ACTIVITIES_PENDING';
fetchActivities.FULFILLED = 'FETCH_ACTIVITIES_FULFILLED';
fetchActivities.REJECTED = 'FETCH_ACTIVITIES_REJECTED';

filterActivities.FILTER = 'FILTER_ACTIVITIES';

resetActivities.RESET = 'RESET_ACTIVITIES';

fetchAutocomplete.FETCH = 'FETCH_AUTOCOMPLETE';
