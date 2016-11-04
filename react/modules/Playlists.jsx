import React from 'react';
import {Component} from 'react';
import _ from 'underscore';
import Playlists from '../components/playlists/Playlists';
import Search from '../components/search/Search';
import Collection from '../../app/modules/playlists/models/Playlists';
import Config from '../../app/Config';

class PlaylistsModule extends Component {
    constructor(props) {
        super(props);

        _.bindAll(this, '_onSearch', '_onSearchChannel');

        this.state = {
            search: '',
            channel: Config.channelRBTV
        };

        this.searchCollection = new Collection();
    }

    render() {
        const stateSearch = this.state.search;
        const stateChannel = this.state.channel;

        return (
            <div className="module-playlists">
                <Search
                    value={stateSearch}
                    onSearch={this._onSearch}
                    onChannel={this._onSearchChannel}/>
                <Playlists
                    collection={this.searchCollection}
                    channel={stateChannel}
                    search={stateSearch}/>
            </div>
        );
    }

    _onSearch(search) {
        this.setState({ search });
    }

    _onSearchChannel(channel) {
        this.setState({ channel });
    }
}

export default PlaylistsModule;
