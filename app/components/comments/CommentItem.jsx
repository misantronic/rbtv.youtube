const React = require('react');
const _ = require('underscore');
const ThumbsComponent = require('../video/details/Thumbs');
const CommentList = require('./CommentList');
const CommentsCollection = require('../../datasource/collections/CommentsCollection');

/**
 * @class CommentItemComponent
 */
class CommentItemComponent extends React.Component {
    constructor(props) {
        super(props);

        _.bindAll(this, '_onToggleReplies');

        const repliesCollection = new CommentsCollection();

        repliesCollection.setParentId(props.item.id);

        this.state = {
            repliesCollection,
            showReplies: false
        };
    }

    getChildContext() {
        return { collection: this.state.repliesCollection };
    }

    render() {
        const item = this.props.item;
        const snippet = item.get('snippet');
        const image = snippet.authorProfileImageUrl;
        const author = snippet.authorDisplayName;
        const authorChannel = snippet.authorChannelUrl;
        const text = snippet.textDisplay;
        const publishedAt = snippet.publishedAt;
        const numReplies = snippet.totalReplyCount;
        const likeCount = snippet.likeCount;
        const dislikeCount = null;

        return (
            <div className="component-comment-item">
                <img className="thumb" src={image} alt={author}/>
                <div className="content">
                    <div className="body">
                        <p dangerouslySetInnerHTML={{ __html: text }}></p>
                    </div>
                    <div className="reactions">
                        <a href="#">Reply</a>
                        <ThumbsComponent statistics={{ likeCount, dislikeCount }}/>
                        <div className="right">
                            <a href={authorChannel} target="_blank">{author}</a>
                            <span className="published-at">{publishedAt.fromNow()}</span>
                        </div>
                    </div>
                    <a href="#" className="btn-replies"
                       onClick={this._onToggleReplies}
                       style={{ display: numReplies ? 'block' : 'none' }}>
                        {this.state.showReplies ? 'hide' : 'show'} {numReplies} replies
                    </a>
                    <CommentList />
                </div>
            </div>
        );
    }

    _onToggleReplies(e) {
        const showReplies = this.state.showReplies;
        const repliesCollection = this.state.repliesCollection;

        this.setState({ showReplies: !showReplies }, () => {
            if (showReplies) {
                repliesCollection.reset();
                this.forceUpdate();
            } else {
                repliesCollection.fetch();
            }
        });

        e.preventDefault();
    }
}

CommentItemComponent.childContextTypes = {
    collection: React.PropTypes.object
};

CommentItemComponent.propTypes = {
    item: React.PropTypes.object
};

module.exports = CommentItemComponent;
