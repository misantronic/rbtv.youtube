const React = require('react');
const render = require('react-dom').render;
const Router = require('react-router').Router;
const Route = require('react-router').Route;
const hashHistory = require('react-router').hashHistory;
const IndexRoute = require('react-router').IndexRoute;
const $ = require('jquery');

const Activities = require('./modules/Activities');
const Playlists = require('./modules/Playlists');
const Playlist = require('./modules/Playlist');
const WatchLater = require('./modules/WatchLater');
const Video = require('./modules/Video');
const App = require('./modules/App');
const Live = require('./modules/Live');

require('./utils/youtubeController').init();
require('./overrides/underscore');

require('react-select/dist/react-select.css');
require('../assets/css/react/_deps.scss');
require('../assets/css/react/_package.scss');

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
