import React from 'react';
import {Component} from 'react';
import VideoList from './../components/VideoList/List';
import Search from './../components/Search/Search';
import Collection from '../../app/modules/search/models/SearchResults';
import Config from '../../app/Config';

class Activities extends Component {
    constructor(props) {
        super(props);

        this._onSearch = this._onSearch.bind(this);
        this._onSearchChannel = this._onSearchChannel.bind(this);

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
            <div className="module-activities">
                <Search
                    value={stateSearch}
                    onSearch={this._onSearch}
                    onChannel={this._onSearchChannel} />
                <VideoList
                    collection={this.searchCollection}
                    channel={stateChannel}
                    search={stateSearch}
                />
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

export default Activities;
