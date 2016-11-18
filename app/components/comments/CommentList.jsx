const React = require('react');
const CollectionLoader = require('../../behaviors/CollectionLoader');

/**
 * @class CommentList
 */
class CommentList extends React.Component {
    constructor(props, context) {
        super(props, context);

        const collection = this.context.collection;

        collection.listenTo(collection, 'sync', () => this.forceUpdate());
    }

    render() {
        const CommentItemComponent = require('./CommentItem');
        const collection = this.context.collection;

        return (
            <CollectionLoader>
                <div className="component-comment-list">
                    {collection.map(item => <CommentItemComponent key={item.id} item={item}/>)}
                </div>
            </CollectionLoader>
        );
    }

    componentWillUnmount() {
        const collection = this.context.collection;

        collection.stopListening(collection, 'sync');
    }
}

CommentList.contextTypes = {
    collection: React.PropTypes.object
};

module.exports = CommentList;
