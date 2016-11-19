const React = require('react');
const CollectionLoader = require('../../behaviors/CollectionLoader');
const CollectionScrolling = require('../../behaviors/CollectionScrolling');
const CommentItemComponent = require('./CommentItem');
const CommentThreadsCollection = require('../../datasource/collections/CommentThreadsCollection');

/**
 * @class CommentThreadsList
 */
class CommentThreadsList extends React.Component {
    constructor(props) {
        super(props);

        const collection = new CommentThreadsCollection();

        collection.setVideoId(props.id);

        this.state = { collection };
    }

    getChildContext() {
        return { collection: this.state.collection };
    }

    render() {
        const collection = this.state.collection;

        return (
            <CollectionScrolling onUpdate={this._fetch.bind(this)}>
                <CollectionLoader>
                    <div className="component-comment-threads-list">
                        {collection.map(item => <CommentItemComponent key={item.id} item={item}/>)}
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

    _fetch() {
        const collection = this.state.collection;

        collection
            .fetch()
            .then(() => this.forceUpdate());
    }
}

CommentThreadsList.childContextTypes = {
    collection: React.PropTypes.object
};

module.exports = CommentThreadsList;
