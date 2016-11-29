const React = require('react');
const _ = require('underscore');
const $ = require('jquery');
const Config = require('../../Config');
const CollectionLoader = require('../../behaviors/CollectionLoader');
const CollectionScrolling = require('../../behaviors/CollectionScrolling');
const Thumb = require('../commons/Thumbnail');
const BtnWatchLater = require('../commons/BtnWatchLater');

class Playlists extends React.Component {
    constructor(props) {
        super(props);

        _.bindAll(this, '_onFetchNext');

        const { collection, scrolling, limit, channels } = this.props;

        this.state = {
            collection,
            limit: scrolling === Infinity ? limit : Infinity,
            channels
        };
    }

    /**
     * Lifecycle methods
     */

    getChildContext() {
        return { collection: this.state.collection };
    }

    render() {
        const collection = this.state.collection;

        return (
            <CollectionScrolling uid={this.props.uid} onUpdate={this._onFetchNext}>
                <CollectionLoader>
                    <div className="component-playlists items">
                        {collection.map(function (item, i) {
                            const id = item.id;
                            const title = item.get('title');
                            const desc = item.get('description');
                            const image = item.get('thumbnails').high.url;
                            const itemCount = item.get('itemCount');

                            return (
                                <div key={id} className="item">
                                    <Thumb
                                        link={'#/playlists/' + id}
                                        title={title}
                                        description={desc}
                                        image={image}
                                        badge={<span className="badge">{itemCount}</span>}>
                                        <BtnWatchLater id={id} type="playlist"/>
                                    </Thumb>
                                </div>
                            );
                        }, this)}
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

    componentWillUnmount() {
        if (this._xhr) {
            this._xhr.abort();
        }
    }

    /**
     * Private methods
     */

    _shouldInvalidate(props) {
        return props.search !== this.props.search ||
            props.channels !== this.props.channels;
    }

    _fetch() {
        const collection = this.state.collection;

        this._xhr = collection.fetch();
        this._xhr.then(() => this._search());
    }

    _search(add = false) {
        const collection = this.state.collection;

        collection.filterBy({
            search: this.props.search,
            channels: this.props.channels,
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

Playlists.defaultProps = {
    search: '',
    channels: [Config.channels.rbtv.id],
    limit: 21,
    scrolling: Infinity
};

Playlists.childContextTypes = {
    collection: React.PropTypes.object
};

module.exports = Playlists;
