const React = require('react');
const _ = require('underscore');
const VideoList = require('../components/video/list/VideoList');
const Search = require('../components/search/Search');
const SearchCollection = require('../models/SearchResults');
const Config = require('../Config');
const storage = require('../utils/storage');

class ActivitiesModule extends React.Component {
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
                    onChannel={this._onSearchChannel}/>
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

module.exports = ActivitiesModule;
