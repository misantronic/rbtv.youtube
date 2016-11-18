const React = require('react');
const $ = require('jquery');
const _ = require('underscore');

/**
 * @class CollectionScrolling
 */
class CollectionScrolling extends React.Component {

    constructor(props, context) {
        super(props, context);

        _.bindAll(this, '_onScroll', '_onCollectionSync', '_onCollectionRequest');

        this.state = {
            request: false
        };

        const collection = this.context.collection;

        collection.listenTo(collection, 'request', this._onCollectionRequest);
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

        const collection = this.context.collection;

        collection.stopListening(collection, 'request', this._onCollectionRequest);
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
        const collection = this.context.collection;

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
        if (this.state.request) return false;

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

    _onCollectionRequest() {
        this.setState({ request: true });
    }

    _onCollectionSync() {
        this.setState({ request: false });

        if (!this.props.onUpdate) {
            this._update();
        }

        this._initScroll();
    }
}

CollectionScrolling.contextTypes = {
    collection: React.PropTypes.object
};

module.exports = CollectionScrolling;
