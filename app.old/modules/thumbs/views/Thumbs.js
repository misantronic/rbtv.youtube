import _ from 'underscore';
import {ItemView} from 'backbone.marionette';
import {Model} from 'backbone';
import youtubeController from '../../youtube/controller';

const Thumbs = ItemView.extend({

    className: 'layout-thumbs',

    template: require('../templates/thumbs.ejs'),


    viewOptions: [
        'resourceId',
        'hideLikes',
        'hideDislikes',
        'checkOwnRating',
        'canRate'
    ],

    ui: {
        likes: '.js-count-likes',
        dislikes: '.js-count-dislikes',
        btnLike: '.js-btn-like',
        btnDislike: '.js-btn-dislike'
    },

    events: {
        'click @ui.btnLike': '_onClickLike',
        'click @ui.btnDislike': '_onClickDislike'
    },

    bindings: {
        '@ui.btnLike': {
            classes: {
                active: '_liked',
                canRate: '_canRate'
            }
        },

        '@ui.btnDislike': {
            classes: {
                active: '_disliked',
                canRate: '_canRate'
            }
        },

        '@ui.likes': {
            observe: 'likeCount',
            classes: {
                'has-likes': 'likeCount'
            }
        },

        '@ui.dislikes': 'dislikeCount'
    },

    initialize(options) {
        _.bindAll(this, '_onRated');

        this.mergeOptions(options, this.viewOptions);

        this.model = new Model({
            _liked: false,
            _disliked: false,
            _canRate: this.getOption('canRate'),
            likeCount: 0,
            dislikeCount: 0
        });

        const resourceId = this.getOption('resourceId');

        this.model.set({
            resourceId,
            likeCount: this.getOption('likeCount') || 0,
            dislikeCount: this.getOption('dislikeCount') || 0
        });

        if (this.getOption('checkOwnRating')) {
            // Get rating from user
            youtubeController.getRating(resourceId, rating => {
                this.model.set({
                    _liked: rating === 'like',
                    _disliked: rating === 'dislike'
                });
            });
        }
    },

    onRender() {
        if (this.getOption('hideLikes')) {
            this.ui.likes.hide();
            this.ui.btnLike.hide();
        }

        if (this.getOption('hideDislikes')) {
            this.ui.dislikes.hide();
            this.ui.btnDislike.hide();
        }

        this.stickit();
    },

    _onClickLike() {
        const rating = this.model.get('_liked') ? 'none' : 'like';

        youtubeController
            .addRating(rating, this.model.get('resourceId'))
            .done(this._onRated);
    },

    _onClickDislike() {
        const rating = this.model.get('_disliked') ? 'none' : 'dislike';

        youtubeController
            .addRating(rating, this.model.get('resourceId'))
            .done(this._onRated);
    },

    _onRated(rating) {
        const _liked = rating === 'like';
        const _disliked = rating === 'dislike';
        const _none = rating === 'none';

        let likeCount = this.model.get('likeCount');
        let dislikeCount = this.model.get('dislikeCount');

        if (_liked) {
            likeCount++;

            if (this.model.get('_disliked')) {
                dislikeCount--;
            }
        }

        if (_disliked) {
            dislikeCount++;

            if (this.model.get('_liked')) {
                likeCount--;
            }
        }

        if (_none) {
            if (this.model.get('_liked')) {
                likeCount--;
            }

            if (this.model.get('_disliked')) {
                dislikeCount--;
            }
        }

        this.model.set({
            _liked,
            _disliked,
            likeCount,
            dislikeCount
        });
    }
});

export default Thumbs;
