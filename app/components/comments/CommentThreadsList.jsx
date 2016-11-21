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
                    <div className="component-comment-threads-list">
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
    }

    _fetch() {
        const collection = this.state.collection;

        collection
            .fetch()
            .then(() => this.forceUpdate());
    }
}

CommentThreadsList.childContextTypes = {
    collection: React.PropTypes.object,
    videoId: React.PropTypes.string
};

module.exports = CommentThreadsList;
