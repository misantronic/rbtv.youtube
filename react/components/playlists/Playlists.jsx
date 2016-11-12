const React = require('react');
const _ = require('underscore');
const Config = require('../../Config');
const CollectionLoader = require('../../behaviors/CollectionLoader');
const CollectionScrolling = require('../../behaviors/CollectionScrolling');
const ThumbComponent = require('../commons/Thumb');
const BtnWatchLater = require('../commons/BtnWatchLater');

class PlaylistsComponent extends React.Component {
    constructor(props) {
        super(props);

        _.bindAll(this, '_onFetchNext');

        const collection = this.props.collection;
        const scrolling = this.props.scrolling;
        const limit = this.props.limit;
        const channels = this.props.channels;

        this.state = {
            collection: collection.clone(),
            limit: scrolling === Infinity ? limit : Infinity,
            channels
        };
    }

    /**
     * Lifecycle methods
     */

    render() {
        const collection = this.state.collection;

        return (
            <CollectionScrolling collection={collection} onUpdate={this._onFetchNext}>
                <CollectionLoader collection={collection}>
                    <div className="component-playlists items">
                        {collection.map(function (item) {
                            const id = item.id;
                            const title = item.get('title');
                            const desc = item.get('description');
                            const image = item.get('thumbnails').high.url;
                            const itemCount = item.get('itemCount');

                            return (
                                <div key={id} className="item">
                                    <ThumbComponent
                                        link={'#/playlists/' + id}
                                        title={title}
                                        description={desc}
                                        image={image}
                                        badge={<span className="badge">{itemCount}</span>}>
                                        <BtnWatchLater id={id} type="playlist"/>
                                    </ThumbComponent>
                                </div>
                            );
                        })}
                    </div>
                </CollectionLoader>
            </CollectionScrolling>
        );
    }

    componentDidMount() {
        this._fetch();
    }

    componentDidUpdate(prevProps) {
        if (this._shouldInvalidate(prevProps)) {
            this._search();
        }
    }

    /**
     * Private methods
     */

    _shouldInvalidate(props) {
        return props.search !== this.props.search ||
            props.channel !== this.props.channel;
    }

    _fetch() {
        const collection = this.state.collection;

        collection
            .fetch()
            .then(() => this._search());
    }

    _search(add = false) {
        const collection = this.state.collection;
        const channels = this.state.channels.slice(0);

        if (channels.length === 0) {
            channels.push(this.props.channel);
        }

        collection.filterBy({
            search: this.props.search,
            channelRBTV: _.contains(channels, Config.channelRBTV),
            channelLP: _.contains(channels, Config.channelLP),
            limit: this.state.limit,
            add
        });

        this.forceUpdate();
    }

    _onFetchNext() {
        if (this.props.scrolling === Infinity) {
            this._search(true);
        }
    }
}

PlaylistsComponent.defaultProps = {
    search: '',
    channel: Config.channelRBTV,
    channels: [],
    limit: 21,
    scrolling: Infinity
};

module.exports = PlaylistsComponent;
