const React = require('react');
const _ = require('underscore');
const watchlist = require('../utils/watchlist');
const VideoCollection = require('../datasource/collections/VideosCollection');
const PlaylistCollection = require('../datasource/collections/PlaylistsCollection');
const VideoList = require('../components/video/list/VideoList');
const Playlists = require('../components/playlists/Playlists');
const BtnToTop = require('../components/commons/BtnToTop');
const Config = require('../Config');

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
