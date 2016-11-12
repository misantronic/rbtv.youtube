import React from 'react';
import Config from '../../../app/Config';
import CollectionLoader from '../../behaviors/CollectionLoader';
import CollectionScrolling from '../../behaviors/CollectionScrolling';
import BtnWatchLater from '../commons/BtnWatchLater';

class PlaylistItemsComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: this.props.id,
            collection: this.props.collection.clone()
        };
    }

    render() {
        const collection = this.state.collection;
        const self = this;

        // Listen to collection-scrolling updates
        // TODO: find a way to perform this automatically
        collection.stopListening(collection, 'react:update');
        collection.listenTo(collection, 'react:update', () => this.forceUpdate());

        return (
            <div className="component-playlist-items">
                <CollectionScrolling collection={collection} limit="30" container=".component-playlist-items">
                    <CollectionLoader collection={collection}>
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

export default PlaylistItemsComponent;
