import Config from '../Config';
import storage from '../utils/storage';
import {fetchActivities, filterActivities, resetActivities, fetchAutocomplete} from '../actions/activities';

const storageFilter = storage.get('activities.filter') || {};

const initialState = {
    loading: false,
    fetched: false,
    error: null,
    items: [],
    autocomplete: [],
    channelId: storageFilter.channelId || Config.channels.rbtv.id,
    q: storageFilter.q || '',
    nextPageToken: ''
};

export default function (state = initialState, action) {
    const { items, q, nextPageToken, channelId, error, autocomplete } = action;

    switch (action.type) {
        case fetchActivities.PENDING:
            return {
                ...state,
                fetched: false,
                loading: true
            };

        case fetchActivities.REJECTED:
            return {
                ...state,
                loading: false,
                fetched: false,
                error
            };

        case fetchActivities.FULFILLED:
            return {
                ...state,
                loading: false,
                fetched: true,
                items,
                q,
                nextPageToken
            };

        case filterActivities.FILTER:
            return {
                ...state,
                q,
                channelId
            };

        case resetActivities.RESET:
            return {
                ...state,
                items,
                nextPageToken
            };

        case fetchAutocomplete.FETCH:
            return {
                ...state,
                autocomplete
            };

        default:
            return state;
    }
};
