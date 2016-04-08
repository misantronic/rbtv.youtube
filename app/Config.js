import {Collection} from 'backbone'

const apiBaseUrl = '/api';

export default {
    endpoints: {
        playlists: apiBaseUrl + '/playlists',
        playlistItems: apiBaseUrl + '/playlistItems',
        activities: apiBaseUrl + '/activities',
        search: apiBaseUrl + '/search',
        videos: apiBaseUrl + '/videos',
        mergePlaylist: apiBaseUrl +'/mergePlaylists'
    },

    key: 'AIzaSyD0WjzJ5761EemQ-lVor5er2JLR3PJGsGk',

    channelRBTV: 'UCQvTDmHza8erxZqDkjQ4bQQ',

    channelLP: 'UCtSP1OA6jO4quIGLae7Fb4g',

    navigation: new Collection([
        { title: 'Übersicht', route: 'overview' },
        { title: 'Playlists', route: 'playlists' }
    ])
}