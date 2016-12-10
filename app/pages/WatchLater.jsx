import React from 'react';
import _ from 'underscore';
import watchlist from '../utils/watchlist';
import VideoCollection from '../datasource/collections/VideosCollection';
import PlaylistCollection from '../datasource/collections/PlaylistsCollection';
import VideoList from '../components/list/ItemList';
import Playlists from '../components/playlists/Playlists';
import BtnToTop from '../components/commons/BtnToTop';
import Config from '../Config';

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
            Config.channels.rbtv.id,
            Config.channels.lp.id,
            Config.channels.g2.id
        ];

        return (
            <div className="module-watchlater">
                <h2>Videos</h2>
                <VideoList collection={this.videoCollection}/>
                <h2>Playlist</h2>
                <Playlists collection={this.playlistCollection} channels={channels} scrolling="false"/>
                <BtnToTop/>
            </div>
        );
    }
}

module.exports = WatchLaterModule;
