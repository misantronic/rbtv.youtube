import React from 'react';
import _ from 'underscore';
import Loader from './../components/loader/Loader';

class CollectionLoader extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false
        };

        _.bindAll(this, '_onCollectionRequest', '_onCollectionSync');

        const collection = this.props.collection;

        collection.listenTo(collection, 'request', this._onCollectionRequest);
        collection.listenTo(collection, 'sync', this._onCollectionSync);
    }

    render() {
        return (
            <div className={'collection-loader-behavior' + (this.state.loading ? ' is-loading' : '')}>
                {this.props.children}
                <Loader/>
            </div>
        );
    }

    componentWillUnmount() {
        const collection = this.props.collection;

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
}

export default CollectionLoader;
