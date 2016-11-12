const React = require('react');
const _ = require('underscore');
const Playlists = require('../components/playlists/Playlists');
const Search = require('../components/search/Search');
const Collection = require('../models/Playlists');
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

module.exports = PlaylistsModule;
