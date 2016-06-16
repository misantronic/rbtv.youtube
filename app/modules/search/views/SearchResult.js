import _ from 'underscore';
import {LayoutView, ItemView} from 'backbone.marionette';
import beans from '../../../data/beans';
import {localStorage} from '../../../utils';
import TagsView from '../../tags/views/Tags';
import TagCollection from '../../tags/models/Tags';
import channels from '../../../channels';
import  VideoModel from '../../videos/models/Video';

const SearchResult = LayoutView.extend({

    className: 'item col-xs-12 col-sm-4',

    template: require('../templates/video-item.ejs'),

    ui: {
        link: '.js-link',
        team: '.region-team',
        duration: '.js-duration'
    },

    regions: {
        team: '.region-team'
    },

    bindings: {
        '@ui.team': {
            observe: 'tags',
            update($el, tags) {
                if (tags) {
                    // Map only first names
                    tags = _.map(tags, (tag) => {
                        // Special cases
                        if (tag.toLowerCase() === 'daniel budiman') {
                            return 'budi';
                        }

                        // Special cases
                        if (tag.toLowerCase() === 'eddy') {
                            return 'etienne';
                        }

                        return tag.split(' ')[0];
                    });

                    // Match names
                    const names = _.iintersection(_.map(beans, bean => bean.title), tags);

                    if (names.length) {
                        const tagsView = new TagsView({
                            collection: new TagCollection(
                                _.map(names, name => ({
                                    title: name.substr(0, 1).toUpperCase() + name.substr(1)
                                }))
                            )
                        });

                        this.getRegion('team').show(tagsView);

                        this.listenTo(tagsView, 'childview:link:selected', view => channels.app.trigger('tag:selected', view));
                    }
                }
            }
        },

        '@ui.duration': {
            observe: 'duration',

            update: ($el, val) => {
                $el.text(VideoModel.humanizeDuration(val));
            }
        },

        ':el': {
            classes: {
                'watched': '_watched'
            }
        }
    },

    initialize() {
        this._initWatched();
    },

    onRender() {
        this._initTooltip();

        this.stickit();
    },

    onDestroy() {
        this.$('[data-toggle="tooltip"]').tooltip('destroy');
    },

    _initTooltip() {
        this.$('[data-toggle="tooltip"]').tooltip({
            delay: { show: 250, hide: 100 }
        });
    },

    _initWatched() {
        const videoId = this.model.get('videoId');
        const watched = !!localStorage.get(`${videoId}.info`, 'watched');

        this.model.set('_watched', watched);
    }
});

const SearchItemEmpty = ItemView.extend({
    className: 'item item-empty text-center col-xs-12',

    template: require('../templates/empty.ejs')
});

export {SearchResult, SearchItemEmpty};
export default SearchResult;
