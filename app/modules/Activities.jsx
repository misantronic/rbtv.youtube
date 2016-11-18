const React = require('react');
const _ = require('underscore');
const VideoList = require('../components/video/list/VideoList');
const Search = require('../components/search/Search');
const BtnToTop = require('../components/commons/BtnToTop');
const SearchCollection = require('../datasource/collections/SearchResultsCollection');
const AutocompleteCollection = require('../datasource/collections/AutocompleteCollection');
const Config = require('../Config');
const storage = require('../utils/storage');

class ActivitiesModule extends React.Component {
    constructor(props) {
        super(props);

        _.bindAll(this, '_onSearch', '_onSearchChannel', '_onFilterUpdate');

        const filter = storage.get('activities.filter');

        this.state = {
            search: filter.search || '',
            channel: filter.channel || Config.channels.rbtv.id
        };

        this.searchCollection = new SearchCollection();
        this.autocompleteCollection = new AutocompleteCollection();
    }

    render() {
        const stateSearch = this.state.search;
        const stateChannel = this.state.channel;

        return (
            <div className="module-activities">
                <Search value={stateSearch} channel={stateChannel} autocomplete={this.autocompleteCollection}
                        onSearch={this._onSearch} onChannel={this._onSearchChannel}/>
                <VideoList collection={this.searchCollection} channel={stateChannel} search={stateSearch}/>
                <BtnToTop/>
            </div>
        );
    }

    _onSearch(search, channel = this.state.channel) {
        this.setState({ search, channel }, this._onFilterUpdate);
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
}

module.exports = ActivitiesModule;
