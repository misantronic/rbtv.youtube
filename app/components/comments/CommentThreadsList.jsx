const $ = require('jquery');
const moment = require('moment');
const React = require('react');
const CollectionLoader = require('../../behaviors/CollectionLoader');
const CollectionScrolling = require('../../behaviors/CollectionScrolling');
const CommentItem = require('./CommentItem');

/**
 * @class CommentThreadsList
 */
class CommentThreadsList extends React.Component {
    constructor(props) {
        super(props);

        const collection = this.props.collection;

        collection.setVideoId(props.id);
        collection.on('react:update remove', () => this.forceUpdate());

        this.state = { collection };
    }

    getChildContext() {
        return {
            collection: this.state.collection,
            videoId: this.props.id
        };
    }

    render() {
        const collection = this.state.collection;

        return (
            <CollectionScrolling onUpdate={() => this._fetch()}>
                <CollectionLoader>
                    <div className="component-comment-threads-list" ref={this._onEl.bind(this)}>
                        {collection.map(item => <CommentItem key={item.id} item={item}/>)}
                    </div>
                </CollectionLoader>
            </CollectionScrolling>
        );
    }

    componentDidUpdate(prevProps) {
        const id = this.props.id;

        if (prevProps.id !== id) {
            const collection = this.state.collection;

            collection.reset();
            collection.setVideoId(id);
        }
    }

    componentWillUnmount() {
        const collection = this.state.collection;

        collection.off('react:update');
        collection.off('remove');

        if (this._xhr) {
            this._xhr.abort();
        }
    }

    _fetch() {
        const collection = this.state.collection;

        this._xhr = collection.fetch();
        this._xhr.then(() => this.forceUpdate());
    }

    _onEl(el) {
        if (el) {
            const $el = $(el);

            $el.off('click').on('click', '.ot-anchor', e => {
                const $target = $(e.target);
                const href = $target.attr('href');
                const regEx = /^https*:\/\/www\.youtube\.com\/watch\?v=(?:.*?)&t=(.*)$/i;

                if (regEx.test(href)) {
                    href.replace(regEx, (str, time) => {
                        const duration = moment.duration('PT' + time.toUpperCase());

                        if (this.props.onSeek) {
                            this.props.onSeek(duration);
                        }
                    });

                    return false;
                }
            });
        }
    }
}

CommentThreadsList.propTypes = {
    collection: React.PropTypes.object,
    id: React.PropTypes.string,
    onSeek: React.PropTypes.func
};

CommentThreadsList.childContextTypes = {
    collection: React.PropTypes.object,
    videoId: React.PropTypes.string
};

module.exports = CommentThreadsList;
