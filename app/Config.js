import {Collection} from 'backbone'

export default {
    endpoints: {
        playlists: 'https://www.googleapis.com/youtube/v3/playlists',
        playlistItems: 'https://www.googleapis.com/youtube/v3/playlistItems',
        activities: 'https://www.googleapis.com/youtube/v3/activities'
    },

    key: 'AIzaSyD0WjzJ5761EemQ-lVor5er2JLR3PJGsGk',

    channelRBTV: 'UCQvTDmHza8erxZqDkjQ4bQQ',

    channelLP: 'UCtSP1OA6jO4quIGLae7Fb4g',

    navigation: new Collection([
        { title: 'Übersicht', route: 'overview' },
        { title: 'Videos', route: 'videos' },
        { title: 'Playlists', route: 'playlists' }
    ])
}