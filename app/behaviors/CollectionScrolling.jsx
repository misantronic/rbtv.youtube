const React = require('react');
const $ = require('jquery');
const _ = require('underscore');
const storage = require('../utils/storage');

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

        collection.on('request', this._onCollectionRequest);
        collection.on('sync', this._onCollectionSync);

        this._updateStorage = _.debounce(y => {
            if (this.props.uid) {
                const expires = new Date().getTime() + 1000 * 60 * 3; // 3 minutes

                storage.update('scrolling', { [this.props.uid]: y, expires });
            }
        }, 128);
    }

    render() {
        if (this.props.container) {
            this.$container = $(this.props.container);
        }

        return this.props.children;
    }

    componentDidMount() {
        this._initScroll();
        this._checkStorageScrolling();
    }

    componentWillUnmount() {
        this._killScroll();

        const collection = this.context.collection;

        collection.off('request', this._onCollectionRequest);
        collection.off('sync', this._onCollectionSync);

        this._resetStorageScrolling();
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

    _checkStorageScrolling() {
        if (!this.props.uid) return false;

        const scrolling = storage.get('scrolling') || {};
        const expires = scrolling.expires;
        const y = scrolling[this.props.uid] || null;

        // Check if scrolling-value has expires
        if (new Date(expires) < new Date()) {
            storage.remove('scrolling');

            return false;
        }

        if (y === null) return false;


        const $container = this.$container ? this.$container : $('body');

        $container.css('min-height', y + innerHeight);
        scrollTo(0, y);

        return true;
    }

    _resetStorageScrolling() {
        const $container = this.$container ? this.$container : $('body');

        $container.removeAttr('style');
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
                if (this.context.collection.getPageToken) {
                    const token = this.context.collection.getPageToken();

                    if (!_.isNull(token)) {
                        this.props.onUpdate();
                    }
                } else {
                    this.props.onUpdate();
                }
            } else {
                this._update();
            }
        }

        this._updateStorage(y);
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
        _.delay(() => this._onScroll(), 16);
    }
}

CollectionScrolling.propTypes = {
    container: React.PropTypes.string,
    onUpdate: React.PropTypes.func,
    uid: React.PropTypes.string
};

CollectionScrolling.contextTypes = {
    collection: React.PropTypes.object
};

module.exports = CollectionScrolling;
