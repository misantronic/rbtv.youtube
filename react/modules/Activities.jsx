import React from 'react';
import {Component} from 'react';
import _ from 'underscore';
import VideoList from '../components/video/list/VideoList';
import Search from '../components/search/Search';
import SearchCollection from '../../app/modules/search/models/SearchResults';
import Config from '../../app/Config';
import storage from '../utils/storage';

class ActivitiesModule extends Component {
    constructor(props) {
        super(props);

        _.bindAll(this, '_onSearch', '_onSearchChannel', '_onCollectionSync', '_onFilterUpdate');

       const filter = storage.get('activities.filter');

        this.state = {
            search: filter.search || '',
            channel: filter.channel || Config.channelRBTV
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
                    channel={stateChannel}
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
        this.setState({ search }, this._onFilterUpdate);
    }

    _onSearchChannel(channel) {
        this.setState({ channel }, this._onFilterUpdate);
    }

    _onFilterUpdate() {
        storage.update('activities.filter', {
            search: this.state.search,
            channel: this.state.channel
        });
    }

    _onCollectionSync() {

    }
}

export default ActivitiesModule;
