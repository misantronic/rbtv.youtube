import React from 'react';
import CollectionLoader from '../../behaviors/CollectionLoader';
import CollectionScrolling from '../../behaviors/CollectionScrolling';
import BtnWatchLater from '../commons/BtnWatchLater';

class PlaylistItemsComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: null
        };
    }

    componentDidUpdate(prevProps) {
        if (this._propHasChanged(prevProps, 'id')) {
            this._selectItem();
        }
    }

    render() {
        const collection = this.props.collection;
        const self = this;

        return (
            <div className="component-playlist-items">
                <CollectionScrolling collection={collection} limit="30" container=".component-playlist-items">
                    <CollectionLoader collection={collection}>
                        {collection.map(function (item) {
                            const videoId = item.get('videoId');
                            const title = item.get('title');
                            const image = item.get('thumbnails').medium.url;

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

    _propHasChanged(prevProps, prop) {
        return prevProps[prop] !== this.props[prop];
    }

    _selectItem(item = null) {
        if (!item) {
            const collection = this.props.collection;

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
