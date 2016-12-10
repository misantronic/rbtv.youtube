import $ from 'jquery';
import React from 'react';

const { render } = require('react-dom');
const { IndexRoute, Router, Route, hashHistory } = require('react-router');
const { Provider } = require('react-redux');

import pages from './pages';
import store from './store';

require('./utils/youtubeController').init();
require('./overrides/underscore');

require('react-select/dist/react-select.css');
require('contextMenu/contextMenu.css');
require('../assets/css/react/_deps.scss');
require('../assets/css/react/_package.scss');

window.onGoogleClientLoad = function () {
    render(
        <Provider store={store}>
            <Router history={hashHistory}>
                <Route path="/" component={pages.App}>
                    <IndexRoute component={pages.Activities}/>

                    <Route path="/activities" component={pages.Activities}/>
                    <Route path="/playlists" component={pages.Playlists}/>
                    <Route path="/playlists/:id" component={pages.Playlist}/>
                    <Route path="/playlists/:id/video/:videoId" component={pages.Playlist}/>
                    <Route path="/watchlater" component={pages.WatchLater}/>
                    <Route path="/video/:id" component={pages.Video}/>
                    <Route path="/live/:id" component={pages.Live}/>
                    <Route path="/timetable" component={pages.Timetable}/>
                </Route>
            </Router>
        </Provider>,
        $('.app').find('.container')[0]
    );
}.bind(this);
