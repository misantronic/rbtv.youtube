const React = require('react');
const _ = require('underscore');
const Loader = require('./../components/loader/Loader');

/**
 * @claas CollectionLoader
 */
class CollectionLoader extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            loading: false
        };

        _.bindAll(this, '_onCollectionRequest', '_onCollectionSync');

        const collection = this.context.collection;

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
        const collection = this.context.collection;

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

CollectionLoader.contextTypes = {
    collection: React.PropTypes.object
};

module.exports = CollectionLoader;
