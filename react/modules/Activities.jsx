import React from 'react';
import {Component} from 'react';
import VideoList from './../components/VideoList/List';
import Collection from '../../app/modules/activities/models/Activities';
import Config from '../../app/Config';

class Activities extends Component {
    constructor(props) {
        super(props);

        this.activities = new Collection();

        this._setChannel(Config.channelRBTV);
    }

    render() {
        return (
            <VideoList collection={this.activities}/>
        );
    }

    _setChannel(id) {
        this.activities.setChannelId(id);
    }
}

export default Activities;
