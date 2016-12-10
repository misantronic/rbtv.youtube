import React from 'react';
import _ from 'underscore';
import Thumbs from '../video/details/Thumbs';
import CommentList from './CommentList';
import CommentForm from './CommentForm';
import CommentsCollection from '../../datasource/collections/CommentsCollection';
import CommentModel from '../../datasource/models/CommentModel';
import BtnContextMenu from '../commons/BtnContextMenu';
import storage from '../../utils/storage';
import youtubeController from '../../utils/youtubeController';

/**
 * @class CommentItem
 */
class CommentItem extends React.Component {
    constructor(props, context) {
        super(props, context);

        _.bindAll(this, '_onToggleReplies', '_onClickDelete', '_onClickUpdate', '_onUpdateSuccess', '_onUpdateAbort', '_onClickReply');

        const editing = props.editing;
        const showReplies = false;
        const repliesCollection = new CommentsCollection();

        this.state = {
            repliesCollection,
            showReplies,
            editing
        };

        repliesCollection.setParentId(props.item.id);
    }

    getChildContext() {
        return { collection: this.state.repliesCollection };
    }

    getContextMenu() {
        return [
            {
                name: 'edit',
                fun: this._onClickUpdate
            },
            {
                name: 'delete',
                fun: this._onClickDelete
            }
        ];
    }

    render() {
        const isEditing = this.state.editing;

        const item = this.props.item;
        const snippet = item.get('snippet');

        const {
            authorProfileImageUrl,
            authorDisplayName,
            authorChannelUrl,
            textDisplay,
            publishedAt,
            totalReplyCount,
            likeCount
        } = snippet;

        const authorChannelId = snippet.authorChannelId.value;
        const dislikeCount = null;

        const channelInfo = storage.getMyChannelInfo();
        const isMine = authorChannelId === channelInfo.id;
        const commentModel = new CommentModel(item.attributes);

        return (
            <div className="component-comment-item">
                <img className="thumb" src={authorProfileImageUrl} alt={authorDisplayName}/>
                <div className="content">
                    <div className="body">
                        { isEditing
                            ? <CommentForm model={commentModel} method="updateComment" onComment={this._onUpdateSuccess} onAbort={this._onUpdateAbort}/>
                            : <p dangerouslySetInnerHTML={{ __html: textDisplay }}></p>
                        }
                        { isMine
                            ? <BtnContextMenu menu={this.getContextMenu()}/>
                            : null
                        }
                    </div>
                    <div className="reactions">
                        <a href="#" onClick={this._onClickReply}>Reply</a>
                        <Thumbs statistics={{ likeCount, dislikeCount }}/>
                        <div className="right">
                            <a href={authorChannelUrl} target="_blank">{authorDisplayName}</a>
                            <span className="published-at">, {publishedAt.fromNow()}</span>
                        </div>
                    </div>
                    {
                        totalReplyCount
                            ? <a href="#" className="btn-replies" onClick={this._onToggleReplies}>{this.state.showReplies ? 'hide' : 'show'} {totalReplyCount} replies</a>
                            : null
                    }
                    <CommentList />
                </div>
            </div>
        );
    }

    componentWillUnmount() {
        if (this._removeCommentXhr) {
            this._removeCommentXhr.abort();
        }
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

    _onClickReply(e) {
        const item = this.props.item;

        console.log('_onClickReply()', item);

        e.preventDefault();
    }

    _onClickUpdate() {
        this.setState({ editing: true });
    }

    _onClickDelete() {
        const item = this.props.item;

        this._removeCommentXhr = youtubeController.removeComment(item);
        this._removeCommentXhr.then(() => {
            item.collection.remove(item);

            youtubeController.invalidateComments(`commentThreads.${this.context.videoId}`);
            youtubeController.invalidateComments(`comments.${this.context.videoId}`);
        });
    }

    _onUpdateSuccess(attributes) {
        const item = this.props.item;

        item.set(item.parse(attributes));

        this.setState({ editing: false });
    }

    _onUpdateAbort() {
        this.setState({ editing: false });
    }
}

CommentItem.defaultProps = {
    editing: false
};

CommentItem.contextTypes = {
    videoId: React.PropTypes.string
};

CommentItem.childContextTypes = {
    collection: React.PropTypes.object
};

CommentItem.propTypes = {
    item: React.PropTypes.object
};

module.exports = CommentItem;
