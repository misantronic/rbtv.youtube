import _ from 'underscore'
import {history} from 'backbone';

import app from './application';

import playlistsController from './modules/playlists/controller';
import activitiesController from './modules/activities/controller';
import videosController from './modules/videos/controller';
import youtubeController from './modules/youtube/controller';

// Router
import './modules/playlists/router';
import './modules/activities/router';
import './modules/videos/router';

var initControllers = function () {
    const mainRegion = app.getRegion('main');
    
    playlistsController.init(mainRegion);
    activitiesController.init(mainRegion);
    videosController.init(mainRegion);
    youtubeController.init();
};

var getFragments = function () {
    return history.fragment.split('/');
};

app.listenTo(app, 'start', function () {
    initControllers();

    history.start();

    app.navigate();

    var fragments = getFragments();
    var rootFragment = _.first(fragments);

    if (rootFragment === 'standalone') {
        return;
    }

    app.initBreadcrumb();
    app.initNavigation();
    app.detectAdBlock();
});

app.start();
