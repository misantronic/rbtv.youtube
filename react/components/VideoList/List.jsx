import React from 'react';
import $ from 'jquery';
import _ from 'underscore';
import {Component} from 'react';
import Item from './Item';

class List extends Component {
    constructor(props) {
        super(props);

        this.state = {
            collection: this.props.collection.clone()
        };

        this._refresh = _.debounce(this._fetch, 350);
    }

    render() {
        const collection = this.state.collection;

        this._initScroll();

        return (
            <div className="activities-items items row">
                {collection.map((item, i) => <Item key={item.id} item={item} index={i}/>)}
            </div>
        );
    }

    componentWillReceiveProps(nextProps) {
        if (this._shouldInvalidate(nextProps)) {
            this.state.collection.reset();
        }
    }

    componentDidMount() {
        this._fetch();
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

    _fetch() {
        const collection = this.state.collection;

        collection.setQ(this.props.search);
        collection.setChannelId(this.props.channel);

        collection
            .fetch()
            .then(() => this.forceUpdate());
    }

    _fetchNext() {
        const collection = this.state.collection;

        const token = collection.getNextPageToken();

        if (token) {
            this._killScroll();

            collection.setNextPageToken(token);
        }

        this._fetch();
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
}

export default List;
