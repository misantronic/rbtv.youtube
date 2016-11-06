import React from 'react';
import $ from 'jquery';
import _ from 'underscore';

export default function (Component, method) {
    return class CollectionScrolling extends React.Component {

        constructor(props) {
            super(props);

            _.bindAll(this, 'componentHasRef', '_onScroll', '_onCollectionSync');
        }

        render() {
            return <Component ref={this.componentHasRef} {...this.props} {...this.state}/>;
        }

        componentDidMount() {
            this._initScroll();
        }

        componentHasRef(component) {
            if (!component) return;

            this.view = component.view || component;

            const collection = this.view.state.collection;

            collection.listenTo(collection, 'sync', this._onCollectionSync);
        }

        componentWillUnmount() {
            this._killScroll();

            const collection = this.view.state.collection;

            if (collection) {
                collection.stopListening(collection, 'sync', this._onCollectionSync);
            }
        }

        _initScroll() {
            this._killScroll();

            $(window).on('scroll', this._onScroll);
        }

        _killScroll() {
            $(window).off('scroll', this._onScroll);
        }

        /**
         * Event handler
         */

        _onScroll() {
            const maxY = $(document).height() - window.innerHeight - 800;
            const y = window.scrollY;

            if (y >= maxY) {
                this._killScroll();
                this.view[method].call(this.view);
            }
        }

        _onCollectionSync() {
            this._initScroll();
        }
    };
};
