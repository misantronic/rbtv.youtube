import {fetchVideos} from '../actions/videos';

const initialState = {
    loading: false,
    fetched: false,
    error: null,
    items: []
};

export default function (state = initialState, action) {
    switch (action.type) {
        case fetchVideos.PENDING:
            return {
                ...state,
                fetched: false,
                loading: true
            };

        case fetchVideos.REJECTED:
            return {
                ...state,
                loading: false,
                fetched: false,
                error: action.error
            };

        case fetchVideos.FULFILLED:
            return {
                ...state,
                loading: false,
                fetched: true,
                items: action.items
            };

        default:
            return state;
    }
};
