import React from 'react';
import $ from 'jquery';
import _ from 'underscore';
import {Component} from 'react';
import Item from './PlaylistsItem';
import Loader from './../loader/Loader';
import Collection from '../../../app/modules/playlists/models/Playlists';
import Config from '../../../app/Config';

class PlaylistsComponent extends Component {
    constructor(props) {
        super(props);

        this._validateProps();

        const collection = this.props.collection.clone();

        this.state = {
            collection,
            loading: false
        };

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
            <div className={'component-playlists items' + (this.state.loading ? ' is-loading' : '')}>
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
            this._search();
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
            throw new Error('collection must be an instance of /app/modules/playlists/models/Playlists');
        }
    }

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

        collection.filterBy({
            search: this.props.search,
            channelRBTV: this.props.channel === Config.channelRBTV,
            channelLP: this.props.channel === Config.channelLP,
            limit: 21,
            add
        });

        this.forceUpdate();
        this._initScroll();
    }

    _initScroll() {
        this._killScroll();

        $(window).on('scroll.playlists', this._onScroll.bind(this));
    }

    _killScroll() {
        $(window).off('scroll.playlists');
    }

    /**
     * Event handler
     */

    _onScroll() {
        const maxY = $(document).height() - window.innerHeight - 800;
        const y = window.scrollY;

        if (y >= maxY) {
            this._search(true);
        }
    }

    _onCollectionRequest() {
        this.setState({ loading: true });
    }

    _onCollectionSync() {
        this.setState({ loading: false });

        this._initScroll();
    }
}

export default PlaylistsComponent;
