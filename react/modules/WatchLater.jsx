import React from 'react';
import {Component} from 'react';
import watchlist from '../utils/watchlist';
import Collection from '../../app/modules/videos/models/Videos';
import VideoList  from '../components/videolist/VideoList';

class WatchLaterModule extends Component {
    constructor(props) {
        super(props);

        const list = watchlist.getList('video');

        this.videoCollection = new Collection();
        this.videoCollection.setVideoIds(_.map(list, item => item.id));
    }

    render() {
        return (
            <div className="module-watchlater">
                <h2>Videos</h2>
                <VideoList collection={this.videoCollection}/>
            </div>
        );
    }
}

export default WatchLaterModule;
