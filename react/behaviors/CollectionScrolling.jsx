import React from 'react';
import $ from 'jquery';
import _ from 'underscore';

class CollectionScrolling extends React.Component {

    constructor(props) {
        super(props);

        _.bindAll(this, '_onScroll', '_onCollectionSync');

        const collection = this.props.collection;

        collection.listenTo(collection, 'sync', this._onCollectionSync);
    }

    render() {
        if (this.props.container) {
            this.$container = $(this.props.container);
        }

        return this.props.children;
    }

    componentDidMount() {
        this._initScroll();
    }

    componentWillUnmount() {
        this._killScroll();

        const collection = this.props.collection;

        collection.stopListening(collection, 'sync', this._onCollectionSync);
    }

    _initScroll() {
        this._killScroll();

        const $container = this.props.container ? $(this.props.container) : $(window);

        $container.on('scroll', this._onScroll);
    }

    _killScroll() {
        const $container = this.props.container ? $(this.props.container) : $(window);

        $container.off('scroll', this._onScroll);
    }

    _update() {
        let limit = Number(this.props.limit) || 10;
        const collection = this.props.collection;

        if (!collection._allModels) {
            collection._allModels = collection.models;
        }

        if (!this._limit) {
            this._limit = 0;
        }

        limit += this._limit;

        this._limit = limit;

        collection.models = _.offset(collection._allModels, 0, limit);

        collection.trigger('react:update');

        this._initScroll();
    }

    /**
     * Event handler
     */

    _onScroll() {
        let maxY = 0;
        let y = 0;

        if (this.$container) {
            maxY = this.$container[0].scrollHeight - this.$container.height();
            y = this.$container[0].scrollTop;
        } else {
            maxY = $(document).height() - window.innerHeight;
            y = window.scrollY;
        }

        maxY -= 800;

        if (y >= maxY) {
            this._killScroll();

            if (this.props.onUpdate) {
                this.props.onUpdate();
            } else {
                this._update();
            }
        }
    }

    _onCollectionSync() {
        if (!this.props.onUpdate) {
            this._update();
        }

        this._initScroll();
    }
}

export default CollectionScrolling;
