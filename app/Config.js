const Collection = require('backbone').Collection;
const env = require('./env');

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

    key: env.YT_KEY,

    channels: {
        rbtv: {
            name: 'Rocket Beans TV',
            short: 'RBTV',
            id: 'UCQvTDmHza8erxZqDkjQ4bQQ'
        },
        lp: {
            name: 'Let\'s Play',
            short: 'LP',
            id: 'UCtSP1OA6jO4quIGLae7Fb4g'
        },
        g2: {
            name: 'Game Two',
            short: 'G2',
            id: 'UCFBapHA35loZ3KZwT_z3BsQ'
        }
    },

    liveId: env.LIVE_ID || 'live_id_undefined',

    navigation: new Collection([
        { title: 'Übersicht', route: 'activities' },
        { title: 'Playlists', route: 'playlists' },
        { title: 'Shows', route: 'shows' }
    ])
};
