import React from 'react';
import {render} from 'react-dom';
import {Router, Route, hashHistory, IndexRoute} from 'react-router';
import $ from 'jquery';

import Activities from './modules/Activities';
import Video from './modules/Video';
import App from './modules/App';

import '../assets/css/react/_deps.scss';
import '../assets/css/react/_package.scss';

render(
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={Activities}/>

            <Route path="/activities" component={Activities}/>
            <Route path="/video/:id" component={Video}/>
        </Route>
    </Router>,
    $('.app').find('.container')[0]
);
