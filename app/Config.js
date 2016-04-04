import {Collection} from 'backbone'

const apiBaseUrl = 'https://www.googleapis.com/youtube/v3';

export default {
    endpoints: {
        playlists: apiBaseUrl + '/playlists',
        playlistItems: apiBaseUrl + '/playlistItems',
        activities: apiBaseUrl + '/activities',
        search: apiBaseUrl + '/search',
        videos: apiBaseUrl + '/videos'
    },

    key: 'AIzaSyD0WjzJ5761EemQ-lVor5er2JLR3PJGsGk',

    channelRBTV: 'UCQvTDmHza8erxZqDkjQ4bQQ',

    channelLP: 'UCtSP1OA6jO4quIGLae7Fb4g',

    navigation: new Collection([
        { title: 'Übersicht', route: 'overview' },
        { title: 'Playlists', route: 'playlists' }
    ])
}