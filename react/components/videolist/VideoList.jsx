import React from 'react';
import _ from 'underscore';
import {Component} from 'react';
import Item from './VideoListItem';
import CollectionLoader from '../../behaviors/CollectionLoader';
import CollectionScrolling from '../../behaviors/CollectionScrolling';

class VideoListComponent extends Component {
    constructor(props) {
        super(props);

        _.bindAll(this, '_onCollectionUpdate', '_onFetchNext');

        const collection = this.props.collection.clone();

        this.state = { collection };

        this._refresh = _.debounce(() => this._fetch(true), 350);

        collection.listenTo(collection, 'sync reset', this._onCollectionUpdate);
    }

    /**
     * Lifecycle methods
     */

    render() {
        const collection = this.state.collection;

        return (
            <CollectionScrolling collection={collection} onUpdate={this._onFetchNext}>
                <CollectionLoader collection={collection}>
                    <div className="component-videolist items">
                        {collection.map((item, i) => <Item key={item.id} item={item} index={i}/>)}
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
            this._refresh();
        }
    }

    componentWillUnmount() {
        const collection = this.state.collection;

        collection.stopListening(collection, 'sync reset', this._onCollectionUpdate);
    }

    /**
     * Private methods
     */

    _shouldInvalidate(props) {
        return props.search !== this.props.search ||
            props.channel !== this.props.channel;
    }

    _fetch(reset = false) {
        const collection = this.state.collection;

        if (reset) {
            collection.reset();
        }

        if (collection.setQ) collection.setQ(this.props.search);
        if (collection.setChannelId) collection.setChannelId(this.props.channel);

        collection.fetch();
    }

    _onFetchNext() {
        const collection = this.state.collection;

        const token = collection.getNextPageToken();

        if (token) {
            collection.setNextPageToken(token);

            this._fetch();
        }
    }

    _onCollectionUpdate() {
        this.forceUpdate();
    }
}

export default VideoListComponent;
