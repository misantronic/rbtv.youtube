const React = require('react');
const render = require('react-dom').render;
const $ = require('jquery');
const VideoList = require('./components/VideoList/List');

import Config from '../app/Config';
import Activities from '../app/modules/activities/models/Activities';

import '../node_modules/bootstrap/dist/css/bootstrap.css';
import '../assets/css/application.scss';
import '../assets/css/components.scss';

const collection = new Activities();

collection
    .setChannelId(Config.channelRBTV)
    .fetch()
    .then(activities => {
        render(
            <VideoList items={activities.items}/>,
            $('.app')[0]
        );
    });
