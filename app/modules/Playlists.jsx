const React = require('react');
const _ = require('underscore');
const Playlists = require('../components/playlists/Playlists');
const Search = require('../components/search/Search');
const BtnToTop = require('../components/commons/BtnToTop');
const Collection = require('../datasource/models/PlaylistsCollection');
const Config = require('../Config');

class PlaylistsModule extends React.Component {
    constructor(props) {
        super(props);

        _.bindAll(this, '_onSearch', '_onSearchChannel');

        this.state = {
            search: '',
            channel: Config.channelRBTV
        };

        this.searchCollection = new Collection();
        this.autocompleteCollection = new Collection();

        this.searchCollection.listenTo(this.searchCollection, 'sync', () => {
            this.autocompleteCollection.reset(this.searchCollection.models);
        });
    }

    render() {
        const stateSearch = this.state.search;
        const stateChannel = this.state.channel;

        return (
            <div className="module-playlists">
                <Search
                    value={stateSearch}
                    onSearch={this._onSearch}
                    onChannel={this._onSearchChannel}
                    autocomplete={this.autocompleteCollection}/>
                <Playlists
                    collection={this.searchCollection}
                    channel={stateChannel}
                    search={stateSearch}/>
                <BtnToTop/>
            </div>
        );
    }

    _onSearch(search, channel = this.state.channel) {
        this.setState({ search, channel });
    }

    _onSearchChannel(channel) {
        this.setState({ channel });
    }
}

module.exports = PlaylistsModule;
