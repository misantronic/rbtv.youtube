import {Collection} from 'backbone';

const apiBaseUrl = '/api';

module.exports = {
    endpoints: {
        playlists: apiBaseUrl + '/playlists',

        playlistItems: apiBaseUrl + '/playlistItems',

        activities: apiBaseUrl + '/activities',

        search: apiBaseUrl + '/search',

        related: apiBaseUrl + '/related',

        videos: apiBaseUrl + '/videos',
        
        commentThreads: apiBaseUrl + '/commentThreads',

        comments: apiBaseUrl + '/comments'
    },

    key: 'AIzaSyD0WjzJ5761EemQ-lVor5er2JLR3PJGsGk',

    channelRBTV: 'UCQvTDmHza8erxZqDkjQ4bQQ',

    channelLP: 'UCtSP1OA6jO4quIGLae7Fb4g',

    channelG2: 'UCFBapHA35loZ3KZwT_z3BsQ',

    liveId: 'rzCDzR8eR7o',

    navigation: new Collection([
        { title: 'Übersicht', route: 'activities' },
        { title: 'Playlists', route: 'playlists' },
        { title: 'Shows', route: 'shows' }
    ])
};
