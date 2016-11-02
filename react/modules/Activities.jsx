const React = require('react');
const Component = React.Component;
const VideoList = require('./../components/VideoList/List');
const Nav = require('./Nav');

import Collection from '../../app/modules/activities/models/Activities';
import Config from '../../app/Config';

class Activities extends Component {
    constructor(props) {
        super(props);

        const actvities = new Collection();

        actvities.setChannelId(Config.channelRBTV);

        this.actvities = actvities;
    }

    render() {
        return (
            <div>
                <Nav/>
                <VideoList collection={this.actvities}/>
            </div>
        );
    }
}

module.exports = Activities;
