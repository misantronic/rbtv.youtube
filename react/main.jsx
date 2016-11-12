import React from 'react';
import {render} from 'react-dom';
import {Router, Route, hashHistory, IndexRoute} from 'react-router';
import $ from 'jquery';

import Activities from './modules/Activities';
import Playlists from './modules/Playlists';
import Playlist from './modules/Playlist';
import WatchLater from './modules/WatchLater';
import Video from './modules/Video';
import App from './modules/App';
import Live from './modules/Live';

import '../app/overrides/underscore';

import '../assets/css/react/_deps.scss';
import '../assets/css/react/_package.scss';

render(
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={Activities}/>

            <Route path="/activities" component={Activities}/>
            <Route path="/playlists" component={Playlists}/>
            <Route path="/playlists/:id" component={Playlist}/>
            <Route path="/playlists/:id/video/:videoId" component={Playlist}/>
            <Route path="/watchlater" component={WatchLater}/>
            <Route path="/video/:id" component={Video}/>
            <Route path="/live/:id" component={Live}/>
        </Route>
    </Router>,
    $('.app').find('.container')[0]
);
