import React from 'react';
import _ from 'underscore';
import Loader from './../components/loader/Loader';

export default function (Component) {
    return class CollectionLoader extends React.Component {
        constructor(props) {
            super(props);

            this.state = {
                loading: false
            };

            _.bindAll(this, '_onCollectionRequest', '_onCollectionSync', 'componentHasRef');
        }

        render() {
            return <div className={'collection-loader-behavior' + (this.state.loading ? ' is-loading' : '')}>
                <Component ref={this.componentHasRef} {...this.props} {...this.state}/>
                <Loader/>
            </div>;
        }

        componentHasRef(component) {
            if (!component) return;

            this.view = component.view || component;

            const collection = this.view.state.collection;

            collection.listenTo(collection, 'request', this._onCollectionRequest);
            collection.listenTo(collection, 'sync', this._onCollectionSync);
        }

        componentWillUnmount() {
            const collection = this.view.state.collection;

            if (collection) {
                collection.stopListening('request', this._onCollectionRequest);
                collection.stopListening('sync', this._onCollectionSync);
            }
        }

        _onCollectionRequest() {
            this.setState({ loading: true });
        }

        _onCollectionSync() {
            this.setState({ loading: false });
        }
    };
};
