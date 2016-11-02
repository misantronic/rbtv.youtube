const React = require('react');
const Component = React.Component;
const VideoList = require('./../components/VideoList/List');
const Nav = require('./Nav');

import Collection from '../../app/modules/activities/models/Activities';
import Config from '../../app/Config';

class Activities extends Component {
    constructor(props) {
        super(props);

        const activities = new Collection();

        activities.setChannelId(Config.channelRBTV);

        this.activities = activities;
    }

    render() {
        return (
            <div>
                <Nav/>
                <VideoList collection={this.activities}/>
            </div>
        );
    }
}

module.exports = Activities;
