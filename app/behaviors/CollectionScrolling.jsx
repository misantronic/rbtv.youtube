import React from 'react';
import $ from 'jquery';
import _ from 'underscore';
import storage from '../utils/storage';

/**
 * @class CollectionScrolling
 */
class CollectionScrolling extends React.Component {

    constructor(props) {
        super(props);

        _.bindAll(this, '_onScroll');

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

    componentDidUpdate(prevProps) {


        if (prevProps.fetched === false && this.props.fetched === true) {
            this._initScroll();
            _.delay(this._onScroll, 16);
        }
    }

    componentWillUnmount() {
        this._killScroll();
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
        if (this.props.loading) return false;

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

            this.props.onUpdate();
        }

        this._updateStorage(y);
    }
}

CollectionScrolling.propTypes = {
    loading: React.PropTypes.bool,
    fetched: React.PropTypes.bool,
    container: React.PropTypes.string,
    onUpdate: React.PropTypes.func,
    uid: React.PropTypes.string
};

CollectionScrolling.defaultProps = {
    onUpdate: _.noop
};

module.exports = CollectionScrolling;
