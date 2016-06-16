import _ from 'underscore';
import $ from 'jquery';
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

const initControllers = function () {
    const mainRegion = app.getRegion('main');
    
    playlistsController.init(mainRegion);
    activitiesController.init(mainRegion);
    videosController.init(mainRegion);
    youtubeController.init();
};

const getFragments = function () {
    return history.fragment.split('/');
};

const getRootFragment = function () {
    const fragments = getFragments();

    return _.first(fragments);
};

app.listenTo(app, 'start', function () {
    initControllers();

    history.start();

    app.navigate();

    const rootFragment = getRootFragment();

    if (rootFragment === 'standalone') {
        $('html').addClass('is-'+ rootFragment);

        return;
    }

    app.initBreadcrumb();
    app.initNavigation();
    app.detectAdBlock();
});

app.start();
