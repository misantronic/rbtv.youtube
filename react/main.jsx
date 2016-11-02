import React from 'react';
import {render} from 'react-dom';
import {Router, Route, hashHistory, IndexRoute} from 'react-router';
import $ from 'jquery';

import Activities from './modules/Activities';
import App from './modules/App';

import '../node_modules/bootstrap/dist/css/bootstrap.css';
import '../assets/css/application.scss';
import '../assets/css/components.scss';

render(
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={Activities}/>

            <Route path="/activities" component={Activities}/>
        </Route>
    </Router>,
    $('.app').find('.container')[0]
);
