import $ from 'jquery'
import _ from 'underscore'
import {CollectionView, LayoutView} from 'backbone.marionette'
import {Model} from 'backbone'
import {props} from '../../decorators'
import ThumbsView from '../../thumbs/views/Thumbs'
import {Comments as CommentsCollection, Comment as CommentModel} from '../models/Comments'
import CommentForm from './CommentForm'

class CommentItem extends LayoutView {
    @props({
        template: require('../templates/comment.ejs'),

        className: 'item-comment col-xs-12',

        regions: {
            replies: '.region-replies',
            replyForm: '.region-reply'
        },

        ui: {
            showReplies: '.js-show-replies',
            loader: '.js-loader',
            btnReply: '.js-reply'
        },

        events: {
            'click @ui.showReplies': '_onToggleReplies',
            'click @ui.btnReply': '_onClickReply'
        }
    })

    bindings() {
        return {
            '@ui.showReplies': {
                observe: '_repliesVisible',
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

        let thumbsView = new ThumbsView({
            resourceId: this.model.id,
            hideLikes: false,
            hideDislikes: true,
            likeCount: snippet.likeCount,
            checkOwnRating: false,
            canRate: false
        }).render();

        this.$('.region-thumbs').html(thumbsView.$el);

        this.stickit();
    }

    _onToggleReplies(e) {
        if (this.model.get('_repliesVisible')) {
            this.getRegion('replies').empty();

            this.model.set('_repliesVisible', false);
        } else {
            let collection = new CommentsCollection();
            let view       = new CommentsItems({ collection, disableScrollEvent: true });

            this.getRegion('replies').show(view);

            this.model.set('loading', true);

            collection.parentId = this.model.id;
            collection.fetch().then(() => {
                this.model.set('loading', false);
            });

            this.model.set('_repliesVisible', true);

            this._repliesCollection = collection;
        }

        e.preventDefault();
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

    _onCommentAdded(commentModel) {
        if(this._repliesCollection) {
            this._repliesCollection.add(commentModel);
        }
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

        $(window).on('scroll.comments.'+ this.cid, this._onScroll.bind(this));
    }

    _killScroll() {
        if (this.getOption('disableScrollEvent')) return;

        $(window).off('scroll.comments.'+ this.cid);
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