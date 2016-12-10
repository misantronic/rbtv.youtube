const combineReducers = require('redux').combineReducers;

import activities from './activities';
import videos from './videos';
import playlists from './playlists';

module.exports = combineReducers({
    activities,
    videos,
    playlists
});
