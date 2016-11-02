const React = require('react');
const render = require('react-dom').render;
const $ = require('jquery');
const Activities = require('./modules/Activities');

import {Router, Route, hashHistory} from 'react-router';

import '../node_modules/bootstrap/dist/css/bootstrap.css';
import '../assets/css/application.scss';
import '../assets/css/components.scss';

render((
        <Router history={hashHistory}>
            <Route path="/" component={Activities}/>
        </Router>
    ),
    $('.app').find('.container')[0]
);
