import React from 'react';
import _ from 'underscore';
import watchlist from '../utils/watchlist';
import VideoCollection from '../../app/modules/videos/models/Videos';
import PlaylistCollection from '../../app/modules/playlists/models/Playlists';
import VideoList  from '../components/video/list/VideoList';
import Playlists  from '../components/playlists/Playlists';
import Config from '../../app/Config';

class WatchLaterModule extends React.Component {
    constructor(props) {
        super(props);

        const videos = watchlist.getList('video');
        const playlists = watchlist.getList('playlist');

        this.videoCollection = new VideoCollection();
        this.videoCollection.setVideoIds(_.map(videos, item => item.id));

        this.playlistCollection = new PlaylistCollection();
        this.playlistCollection.setPlaylistIds(_.map(playlists, item => item.id));
    }

    render() {
        const channels = [
            Config.channelRBTV,
            Config.channelLP
        ];

        return (
            <div className="module-watchlater">
                <h2>Videos</h2>
                <VideoList collection={this.videoCollection}/>
                <h2>Playlist</h2>
                <Playlists collection={this.playlistCollection} channels={channels} scrolling="false"/>
            </div>
        );
    }
}

export default WatchLaterModule;
