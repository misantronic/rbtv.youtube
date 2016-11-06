import React from 'react';
import _ from 'underscore';
import {Component} from 'react';
import Item from './VideoListItem';
import collectionLoader from '../../behaviors/CollectionLoader';
import collectionScrolling from '../../behaviors/CollectionScrolling';

class VideoListComponent extends Component {
    constructor(props) {
        super(props);

        const collection = this.props.collection.clone();

        this.state = { collection };

        this._refresh = _.debounce(() => this._fetch(true), 350);
    }

    /**
     * Lifecycle methods
     */

    render() {
        const collection = this.state.collection;

        return (
            <div className="component-videolist items">
                {collection.map((item, i) => <Item key={item.id} item={item} index={i}/>)}
            </div>
        );
    }

    componentDidMount() {
        _.delay(() => this._fetch(), 32);
    }

    componentDidUpdate(prevProps) {
        if (this._shouldInvalidate(prevProps)) {
            this._refresh();
        }
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

        collection
            .fetch()
            .then(() => this.forceUpdate());
    }

    _fetchNext() {
        const collection = this.state.collection;

        const token = collection.getNextPageToken();

        if (token) {
            collection.setNextPageToken(token);

            this._fetch();
        }
    }
}

VideoListComponent = collectionLoader(VideoListComponent);
VideoListComponent = collectionScrolling(VideoListComponent, '_fetchNext');

export default VideoListComponent;
