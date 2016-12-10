import Config from '../Config';
import storage from '../utils/storage';
import {fetchPlaylists, fetchAutocomplete, filterPlaylists} from '../actions/playlists';

const storageFilter = storage.get('playlists.filter') || {};

const initialState = {
    loading: false,
    fetched: false,
    error: null,
    autocomplete: [],
    items: [],
    q: storageFilter.q || '',
    channelId: storageFilter.channelId || Config.channels.rbtv.id
};

export default function (state = initialState, action) {
    const { type, error, items, autocomplete, q, channelId } = action;

    switch (type) {
        case fetchPlaylists.PENDING:
            return {
                ...state,
                fetched: false,
                loading: true
            };

        case fetchPlaylists.REJECTED:
            return {
                ...state,
                loading: false,
                fetched: false,
                error
            };

        case fetchPlaylists.FULFILLED:
            return {
                ...state,
                loading: false,
                fetched: true,
                items
            };

        case fetchAutocomplete.FETCH:
            return {
                ...state,
                autocomplete
            };

        case filterPlaylists.FILTER:
            return {
                ...state,
                q,
                channelId
            };

        default:
            return state;
    }
};
