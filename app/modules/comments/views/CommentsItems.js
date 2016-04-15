import $ from 'jquery'
import _ from 'underscore'
import {CollectionView, LayoutView} from 'backbone.marionette'
import {Model} from 'backbone'
import {props} from '../../decorators'
import ThumbsView from '../../thumbs/views/Thumbs'
import {Comments as CommentsCollection} from '../models/Comments'

class CommentItem extends LayoutView {
    @props({
        template: require('../templates/comment.ejs'),

        className: 'item-comment col-xs-12',

        regions: {
            replies: '.region-replies'
        },

        ui: {
            showReplies: '.js-show-replies'
        },

        events: {
            'click @ui.showReplies': '_onToggleReplies'
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

            collection.parentId = this.model.id;
            collection.fetch();

            this.model.set('_repliesVisible', true);
        }

        e.preventDefault();
    }
}

class CommentsItems extends CollectionView {
    constructor(options = {}) {
        options.model = new Model({
            _loading: false
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
            'change:_loading': (model, val) => {
                this.trigger('loading', val);
            }
        }

    }

    set loading(val) {
        this.model.set('_loading', val);
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