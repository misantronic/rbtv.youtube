import _ from 'underscore';
import $ from 'jquery';
import {history} from 'backbone';

import app from './application';
import controllers from './controllers';

import './routes';

const initControllers = function () {
    const mainRegion = app.getRegion('main');

    // Initialize all controllers
    _.each(controllers, controller => {
        controller.init(mainRegion);
    });
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

    const rootFragment = getRootFragment();

    if (rootFragment === 'standalone') {
        $('html').addClass('is-' + rootFragment);

        return;
    }

    app
        .initBreadcrumb()
        .initNavigation()
        .detectAdBlock();

    app.navigate();
});

app.start();
