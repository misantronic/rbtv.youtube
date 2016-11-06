import React from 'react';
import {Component} from 'react';
import Item from './PlaylistsItem';
import Config from '../../../app/Config';
import collectionLoader from '../../behaviors/CollectionLoader';
import collectionScrolling from '../../behaviors/CollectionScrolling';

class PlaylistsComponent extends Component {
    constructor(props) {
        super(props);

        const collection = this.props.collection.clone();

        this.state = { collection };
    }

    /**
     * Lifecycle methods
     */

    render() {
        const collection = this.state.collection;

        return (
            <div className="component-playlists items">
                {collection.map((item, i) => <Item key={item.id} item={item} index={i}/>)}
            </div>
        );
    }

    componentDidMount() {
        _.delay(() => this._fetch(), 32);
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

        collection.filterBy({
            search: this.props.search,
            channelRBTV: this.props.channel === Config.channelRBTV,
            channelLP: this.props.channel === Config.channelLP,
            limit: 21,
            add
        });

        this.forceUpdate();
    }

    _append() {
        this._search(true);
    }
}

PlaylistsComponent = collectionLoader(PlaylistsComponent);
PlaylistsComponent = collectionScrolling(PlaylistsComponent, '_append');

export default PlaylistsComponent;
