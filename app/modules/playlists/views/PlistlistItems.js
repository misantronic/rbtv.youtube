import _ from 'underscore';
import {CompositeView, ItemView} from 'backbone.marionette';
import {Model} from 'backbone';
import app from '../../../application';

class PlaylistItem extends ItemView {
    get className() {
        return 'playlist-item js-playlist-item';
    }

    get template() {
        return require('../templates/playlistItem.ejs');
    }

    ui() {
        return {
            link: '.js-link'
        }
    }

    events() {
        return {
            'click @ui.link': '_onClickLink'
        };
    }

    onRender() {
        this.$el.attr('data-videoid', this.model.get('videoId'))
    }

    _onClickLink(e) {
        var route = this.ui.link.attr('href');

        app.navigate(route);

        e.preventDefault();
    }
}

export default class PlaylistItems extends CompositeView {

    constructor(options) {
        _.defaults(options, {
            model: new Model({
                _search: '',
                _videoId: null
            })
        });

        super(options);
    }

    ui() {
        return {
            search: '.js-search'
        }
    }

    get childView() {
        return PlaylistItem;
    }

    get childViewContainer() {
        return '.js-playlist-items'
    }

    get template() {
        return require('../templates/playlistItems.ejs');
    }

    set videoId(val) {
        this.model.set('_videoId', val);
    }

    /**
     * @returns {{search: String}}
     */
    get playlistFilter() {
        return {
            search: this.model.get('_search')
        }
    }

    modelEvents() {
        return {
            'change:_videoId': '_highlightVideo',

            'change:_search': _.debounce(function () {
                this._searchCollection();
                this._highlightVideo();
            }, 50)
        }
    }

    bindings() {
        return {
            '.js-video-container': {
                observe: '_videoId',
                update: _.debounce(function ($el, val) {
                    if (val) {
                        $el.html(`<iframe width="640" height="360" src="https://www.youtube-nocookie.com/embed/${val}" frameborder="0" allowfullscreen></iframe>`)
                    }
                }, 500)
            },

            '@ui.search': '_search'
        }
    }

    onRender() {
        this.stickit();
    }

    _searchCollection() {
        let filter = this.playlistFilter;

        this.collection.search(filter);
    }

    _highlightVideo() {
        this.$childViewContainer.find('.js-playlist-item').removeClass('active');

        var $videoId = this.$childViewContainer.find('[data-videoid="' + this.model.get('_videoId') + '"]');

        $videoId.addClass('active');

        // Scroll
        this.$childViewContainer
            .animate({
                scrollTop: $videoId.index() * 65
            }, 250);
    }

}