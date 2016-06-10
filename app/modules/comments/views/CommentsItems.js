import $ from 'jquery'
import _ from 'underscore'
import {CollectionView, LayoutView} from 'backbone.marionette'
import {Model} from 'backbone'
import {props} from '../../decorators'
import ThumbsView from '../../thumbs/views/Thumbs'
import {Comments as CommentsCollection, Comment as CommentModel} from '../models/Comments'
import CommentForm from './CommentForm'
import {timeUtil} from '../../../utils'
import channels from '../../../channels'

class CommentItem extends LayoutView {
    @props({
        template: require('../templates/comment.ejs'),

        className: 'item-comment col-xs-12',

        regions: {
            replies: '.region-replies',
            replyForm: '.region-form',
            thumbs: '.region-thumbs'
        },

        ui: {
            showReplies: '.js-show-replies',
            loader: '.js-loader',
            btnReply: '.js-reply'
        },

        events: {
            'click @ui.showReplies': '_onToggleReplies',
            'click @ui.btnReply': '_onClickReply',
            'click .body a': '_onClickLink'
        }
    })

    bindings() {
        return {
            '@ui.showReplies': {
                observe: 'repliesVisible',
                update: function ($el, val) {
                    if (val) {
                        $el.text('Verberge Antworten');
                    } else {
                        $el.text('Zeige ' + this.model.get('snippet').totalReplyCount + ' Antworten');
                    }
                }
            },

            '@ui.loader': {
                classes: {
                    show: 'loading'
                }
            }
        }
    }

    onRender() {
        const snippet = this.model.get('snippet');

        this.getRegion('thumbs').show(
            new ThumbsView({
                resourceId: this.model.id,
                hideLikes: false,
                hideDislikes: true,
                likeCount: snippet.likeCount,
                checkOwnRating: false,
                canRate: false
            })
        );

        this.stickit();
    }

    _onToggleReplies(e) {
        const repliesVisible = this.model.get('repliesVisible');

        if (repliesVisible) {
            this._hideReplies();
        } else {
            this._showReplies();
        }

        e.preventDefault();
    }

    _hideReplies() {
        this.getRegion('replies').empty();

        this.model.set('repliesVisible', false);
    }

    _showReplies() {
        let collection = new CommentsCollection();
        let view       = new CommentsItems({ collection, disableScrollEvent: true });

        this.getRegion('replies').show(view);

        this.model.set({
            loading: true,
            repliesVisible: true
        });

        collection.parentId = this.model.id;

        this._repliesCollection = collection;

        return collection.fetch().then(() => this.model.set('loading', false));
    }

    _onClickReply() {
        var formView = new CommentForm({
            canCancel: true,
            model: new CommentModel({
                snippet: {
                    parentId: this.model.id
                }
            })
        });

        this.listenTo(formView, 'comment:add', this._onCommentAdded);
        this.listenTo(formView, 'comment:cancel', this._onCommentCanceled);

        this.getRegion('replyForm').show(formView);
    }

    _onClickLink(e) {
        let href = $(e.currentTarget).attr('href');

        if (href.indexOf('t=') !== -1) {
            var timeStr = href.split('t=')[1];

            if (timeStr) {
                const seconds = timeUtil.videoPositionToSeconds(timeStr);

                channels.comments.trigger('video:seek', seconds);

                // this.triggerChannel('comments', 'video:seek', seconds);
            }
        }

        e.preventDefault();
    }

    _onCommentAdded(commentModel) {
        this._showReplies().then(() => {
            this._repliesCollection.add(commentModel);
        });
    }

    _onCommentCanceled() {
        this.getRegion('replyForm').empty();
    }
}

class CommentsItems extends CollectionView {
    constructor(options = {}) {
        options.model = new Model({
            loading: false
        });

        super(options);
    }

    @props({
        className: 'items-comments',

        childView: CommentItem,

        viewOptions: ['disableScrollEvent']
    })

    collectionEvents() {
        return {
            sync: '_onCollectionSync'
        }
    }

    modelEvents() {
        return {
            'change:loading': (model, val) => {
                this.trigger('loading', val);
            }
        }

    }

    set loading(val) {
        this.model.set('loading', val);
    }

    initialize(options) {
        this.mergeOptions(options, this.viewOptions);
    }

    onRender() {
        this._initScroll();
    }

    /**
     * Private methods
     */

    _fetch() {
        this._killScroll();

        if (_.isNull(this.collection.pageToken)) return;

        this.loading = true;

        this.collection.fetch()
            .then(() => {
                this.loading = false;
            });
    }

    _initScroll() {
        if (this.getOption('disableScrollEvent')) return;

        this._killScroll();

        $(window).on('scroll.comments.' + this.cid, this._onScroll.bind(this));
    }

    _killScroll() {
        if (this.getOption('disableScrollEvent')) return;

        $(window).off('scroll.comments.' + this.cid);
    }

    /**
     * Callbacks
     */

    _onCollectionSync() {
        this._initScroll();
    }

    _onScroll() {
        const maxY = $(document).height() - window.innerHeight - 100;
        const y    = window.scrollY;

        if (y >= maxY) {
            this._fetch();
        }
    }
}

export default CommentsItems