const React = require('react');
const render = require('react-dom').render;
const $ = require('jquery');
const VideoList = require('./components/VideoList/List');

import Activities from '../app/modules/activities/models/Activities';
import Config from '../app/Config';

import '../node_modules/bootstrap/dist/css/bootstrap.css';
import '../assets/css/application.scss';
import '../assets/css/components.scss';

const actvities = new Activities();

actvities.setChannelId(Config.channelRBTV);

render(
    <VideoList collection={actvities}/>,
    $('.app').find('.container')[0]
);
