import React from 'react';
import $ from 'jquery';
import _ from 'underscore';
import {Component} from 'react';
import Item from './VideoListItem';
import Loader from './../loader/Loader';
import Collection from '../../../app/modules/search/models/SearchResults';

class VideoListComponent extends Component {
    constructor(props) {
        super(props);

        this._validateProps();

        const collection = this.props.collection.clone();

        this.state = {
            collection,
            loading: false
        };

        this._refresh = _.debounce(() => this._fetch(true), 350);

        _.bindAll(this, '_onCollectionRequest', '_onCollectionSync');

        collection.listenTo(collection, 'request', this._onCollectionRequest);
        collection.listenTo(collection, 'sync', this._onCollectionSync);
    }

    /**
     * Lifecycle methods
     */

    render() {
        const collection = this.state.collection;

        return (
            <div className={'component-videolist items' + (this.state.loading ? ' is-loading' : '')}>
                {collection.map((item, i) => <Item key={item.id} item={item} index={i}/>)}
                <Loader />
            </div>
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

        if (collection) {
            collection.stopListening('request');
            collection.stopListening('sync');
        }

        this._killScroll();
    }

    /**
     * Private methods
     */

    _validateProps() {
        const collection = this.props.collection;

        if (!collection) {
            throw new Error('Please provide a collection.');
        }

        if (!(collection instanceof Collection)) {
            throw new Error('collection must be an instance of /app/modules/search/models/SearchResults');
        }
    }

    _shouldInvalidate(props) {
        return props.search !== this.props.search ||
            props.channel !== this.props.channel;
    }

    _fetch(reset = false) {
        const collection = this.state.collection;

        if (reset) {
            collection.reset();
        }

        collection
            .setQ(this.props.search)
            .setChannelId(this.props.channel)
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

    _initScroll() {
        this._killScroll();

        $(window).on('scroll.activities', this._onScroll.bind(this));
    }

    _killScroll() {
        $(window).off('scroll.activities');
    }

    /**
     * Event handler
     */

    _onScroll() {
        const maxY = $(document).height() - window.innerHeight - 800;
        const y = window.scrollY;

        if (y >= maxY) {
            this._fetchNext();
        }
    }

    _onCollectionRequest() {
        this._killScroll();

        this.setState({ loading: true });
    }

    _onCollectionSync() {
        this.setState({ loading: false });

        this._initScroll();
    }
}

export default VideoListComponent;
