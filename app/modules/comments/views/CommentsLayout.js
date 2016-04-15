import {Model} from 'backbone'
import {LayoutView} from 'backbone.marionette'
import {props} from '../../decorators'
import CommentsItemsView from './CommentsItems'
import CommentFormView from './CommentForm'

class CommentsLayout extends LayoutView {
    constructor(options = {}) {
        options.model = new Model({
            statistics: 0,
            _loading: false
        });

        super(options);
    }

    @props({
        className: 'layout-comments',

        ui: {
            loader: '.js-loader'
        },

        template: require('../templates/comments.ejs'),

        regions: {
            items: '.region-items',
            form: '.region-form'
        }
    })

    bindings() {
        return {
            '@ui.loader': {
                classes: {
                    show: '_loading'
                }
            }
        }
    }

    set loading(val) {
        this.model.set('_loading', val);
    }

    initialize() {
        this.model.set('statistics', this.getOption('statistics'));
    }

    onRender() {
        const channelId  = this.getOption('channelId');
        const videoId    = this.getOption('videoId');
        const collection = this.getOption('collection');

        const formView  = new CommentFormView({ channelId, videoId }).render();
        const itemsView = new CommentsItemsView({ collection });

        this.listenTo(formView, 'comment:add', this._onCommentAdded);
        this.listenTo(itemsView, 'loading', this._onLoading);

        this.getRegion('items').show(itemsView);
        this.getRegion('form').show(formView);

        this.stickit();
    }

    /**
     * Callbacks
     */

    _onLoading(isLoading) {
        this.model.set('_loading', isLoading)
    }

    _onCommentAdded(commentModel) {
        this.collection.add(commentModel, { at: 0 });
    }
}

export default CommentsLayout