const React = require('react');
const Config = require('../../Config');
const CollectionLoader = require('../../behaviors/CollectionLoader');
const CollectionScrolling = require('../../behaviors/CollectionScrolling');
const BtnWatchLater = require('../commons/BtnWatchLater');

class PlaylistItems extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: this.props.id,
            collection: this.props.collection.clone()
        };
    }

    getChildContext() {
        return { collection: this.state.collection };
    }

    render() {
        const collection = this.state.collection;
        const self = this;

        // Listen to collection-scrolling updates
        // TODO: find a way to perform this automatically
        collection.off('react:update');
        collection.on('react:update', () => this.forceUpdate());

        return (
            <div className="component-playlist-items">
                <CollectionScrolling limit="30" container=".component-playlist-items">
                    <CollectionLoader>
                        {collection.map(function (item) {
                            const videoId = item.get('videoId');
                            const image = item.get('thumbnails').medium.url;
                            const title = item.get('title');

                            if (videoId === Config.liveId) {
                                return '';
                            }

                            return (
                                <div key={item.id} className={'playlist-item' + (self.state.id === videoId ? ' is-active' : '')}>
                                    <div className="image" style={{ backgroundImage: 'url(' + image + ')' }}>
                                        <BtnWatchLater id={videoId} size="small"/>
                                    </div>
                                    <div className="title" onClick={() => self._onItemSelected(item)}>{title}</div>
                                </div>
                            );
                        })}
                    </CollectionLoader>
                </CollectionScrolling>
            </div>
        );
    }

    componentDidUpdate(prevProps) {
        if (this._propHasChanged(prevProps, 'id')) {
            this._selectItem();
        }

        if (this._propHasChanged(prevProps, 'collection')) {
            this.setState({ collection: this.props.collection.clone() }, () => this._fetch());
        }
    }

    componentDidMount() {
        this._fetch();
    }

    _propHasChanged(prevProps, prop) {
        return prevProps[prop] !== this.props[prop];
    }

    _fetch() {
        const collection = this.state.collection;

        collection.fetch().then(() => {
            this.forceUpdate();

            if (this.props.onFetch) {
                this.props.onFetch(collection);
            }
        });
    }

    _selectItem(item = null) {
        if (!item) {
            const collection = this.state.collection;

            item = collection.findWhere({ videoId: this.props.id });
        }

        this.setState({ id: item.get('videoId') });
    }

    _onItemSelected(item) {
        this._selectItem(item);

        if (this.props.onItemSelected) {
            this.props.onItemSelected(item);
        }
    }
}

PlaylistItems.childContextTypes = {
    collection: React.PropTypes.object
};

module.exports = PlaylistItems;
