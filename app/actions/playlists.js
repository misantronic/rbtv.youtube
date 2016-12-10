import _ from 'underscore';
import moment from 'moment';
import axios from 'axios';
import Config from '../Config';
import storage from '../utils/storage';

function parsePlaylists(items) {
    return _.map(items, item => ({
        id: item.id,
        etag: item.etag,
        kind: item.kind,
        itemCount: item.contentDetails.itemCount,
        channelId: item.snippet.channelId,
        description: item.snippet.description,
        publishedAt: moment(item.snippet.publishedAt),
        image: item.snippet.thumbnails.high.url,
        title: item.snippet.title
    }));
}

function sortPlaylists(items) {
    return items.slice(0).sort(function (a, b) {
        const aa = a.title.toLowerCase();
        const bb = b.title.toLowerCase();

        if (aa > bb) return 1;
        if (aa < bb) return -1;
        return 0;
    });
}

export function fetchPlaylists(playlistIds = []) {
    return function (dispatch) {
        dispatch({ type: fetchPlaylists.PENDING });

        const params = {};

        if (playlistIds.length) {
            params.id = playlistIds.join(',');
        }

        axios
            .get(Config.endpoints.playlists, { params })
            .then(res => {
                // Parse data
                let items = parsePlaylists(res.data.items);

                // Sort by title
                items = sortPlaylists(items);

                dispatch({
                    type: fetchPlaylists.FULFILLED,
                    items
                });
            })
            .catch(error => {
                dispatch({
                    type: fetchPlaylists.REJECTED,
                    error
                });
            });
    };
}

export function fetchAutocomplete() {
    const autocomplete = [].concat(require('../datasource/shows'));

    return function (dispatch) {
        dispatch({
            type: fetchAutocomplete.FETCH,
            autocomplete
        });
    };
}

export function filterPlaylists(channelId, q = '') {
    return function (dispatch) {
        storage.update('playlists.filter', {
            q,
            channelId
        });

        dispatch({
            type: filterPlaylists.FILTER,
            channelId,
            q
        });
    };
}

fetchPlaylists.PENDING = 'FETCH_PLAYLISTS_PENDING';
fetchPlaylists.FULFILLED = 'FETCH_PLAYLISTS_FULFILLED';
fetchPlaylists.REJECTED = 'FETCH_PLAYLISTS_REJECTED';

fetchAutocomplete.FETCH = 'FETCH_AUTOCOMPLETE';

filterPlaylists.FILTER = 'FILTER_PLAYLISTS';
