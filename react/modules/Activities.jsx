import React from 'react';
import {Component} from 'react';
import _ from 'underscore';
import VideoList from '../components/video/list/VideoList';
import Search from '../components/search/Search';
import SearchCollection from '../../app/modules/search/models/SearchResults';
import Config from '../../app/Config';

class ActivitiesModule extends Component {
    constructor(props) {
        super(props);

        _.bindAll(this, '_onSearch', '_onSearchChannel', '_onCollectionSync');

        this.state = {
            search: '',
            channel: Config.channelRBTV
        };

        this.searchCollection = new SearchCollection();
        this.searchCollection.listenTo(this.searchCollection, 'sync', this._onCollectionSync);
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

    _onCollectionSync() {

    }
}

export default ActivitiesModule;
