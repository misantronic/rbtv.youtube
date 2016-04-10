import _ from 'underscore'
import $ from 'jquery'
import {LayoutView} from 'backbone.marionette'
import app from '../../../application'
import {localStorage} from '../../../utils'
import {props} from '../../decorators'
import RelatedResults from '../../search/views/RelatedResults'
import SearchResultsCollection from '../../search/models/SearchResults'

class Video extends LayoutView {
    @props({
        className: 'layout-video',

        template: require('../templates/video.ejs'),

        ui: {
            title: '.js-title',
            video: '.js-video-container',
            publishedAt: '.js-publishedAt',
            views: '.js-views',
            description: '.js-description',
            likes: '.js-count-likes',
            dislikes: '.js-count-dislikes'
        },

        regions: {
            related: '.region-related'
        }
    })

    modelEvents() {
        return {
            'change:title': (model, title) => {
                this.ui.title.text(title)
            },

            'change:id': (model, videoId) => {
                model.set('_loading', true);

                model.fetch().then(() => {
                    this._initVideo();
                    this._initRelatedVideos();

                    model.set('_loading', false);
                });
            },

            'change:publishedAt': (model, publishedAt) => {
                this.ui.publishedAt.text(publishedAt.format('LLLL'))
            },

            'change:statistics': (model, statistics) => {
                let views    = statistics.viewCount;
                let likes    = statistics.likeCount;
                let dislikes = statistics.dislikeCount;

                this.ui.views.text(views);

                this.ui.likes.text(likes);

                this.ui.dislikes.text(dislikes);
            },

            'change:description': (model, description) => {
                this.ui.description.html(description);
            },

            'change:_loading': (model, val) => {
                if (val) {
                    this.$el.addClass('loading');
                } else {
                    this.$el.removeClass('loading');
                }
            }
        }
    }

    initialize() {
        _.bindAll(this, '_initVideo');

        this._playerInterval = 0;

        this.listenTo(app.channel, 'resize', _.debounce(this._onResize, 100));
    }

    _initVideo() {
        clearInterval(this._playerInterval);

        const videoId = this.model.id;

        if (videoId) {
            if (this._player && this._player.cueVideoById) {
                // currentTime
                const videoInfo   = localStorage.get(`${videoId}.info`) || {};
                const currentTime = videoInfo.currentTime || 0;

                this._player.cueVideoById(videoId, currentTime);
            } else {
                let containerId = 'yt-video-container';
                let container   = this.$('#' + containerId);
                let height      = container.css('height', 'auto').height();
                let $container         = $('<div id="' + containerId + '"></div>');

                if (height) {
                    $container.css('height', height)
                }

                container.replaceWith($container);

                var initPlayer = function () {
                    this._player = new YT.Player(containerId, {
                        width: 200,
                        height: 200,
                        videoId: videoId,
                        events: {
                            'onReady': this._onVideoReady.bind(this),
                            'onStateChange': this._onVideoStateChange.bind(this)
                        }
                    });

                    this._videoSetSize();
                }.bind(this);

                if (!YT.Player) {
                    window.onYouTubeIframeAPIReady = initPlayer;
                } else {
                    initPlayer();
                }
            }
        }
    }

    _initRelatedVideos() {
        const videoId    = this.model.id;
        const channelId  = this.model.get('channelId');
        const collection = new SearchResultsCollection();

        collection
            .setChannelId(channelId)
            .setRelatedToVideoId(videoId);

        var view = new RelatedResults({
            collection: collection
        });

        this.listenTo(view, 'childview:link:clicked', (view) => {
            let videoId = view.model.get('videoId');

            app.navigate(`video/${videoId}`);
        });

        this.getRegion('related').show(view);

        collection.fetch();
    }

    _videoPlaying() {
        const videoId = this.model.id;

        // Store player-status
        clearInterval(this._playerInterval);

        const updateCurrentTime = () => {
            const currentTime = Math.round(this._player.getCurrentTime());

            localStorage.update(`${videoId}.info`, { currentTime });
        };

        updateCurrentTime();
        this._playerInterval = setInterval(updateCurrentTime, 8000);
    }

    _videoEnded() {
        const videoId = this.model.get('videoId');

        // Mark as watched
        this.collection.getCurrentPlaylistItem(videoId).set('_watched', true);
        localStorage.update(`${videoId}.info`, { watched: true, currentTime: 0 });
    }

    _onVideoReady(e) {
        if (_.isNull(e.data)) {


            this._onResize();
        }
    }

    _videoSetSize() {
        if (this._player) {
            let width  = this.ui.video.width();
            let height = width * 0.51;

            if (window.innerWidth <= 768) {
                width  = '100%';
                height = window.innerWidth * 0.51;
            }

            this._player.setSize(width, height);
        }
    }

    _onVideoStateChange(e) {
        const videoId = this.model.id;

        switch (e.data) {
            case YT.PlayerState.UNSTARTED:

                break;
            case YT.PlayerState.PLAYING:
                this._videoPlaying();
                break;
            case YT.PlayerState.ENDED:
                this._videoEnded();
                break;
        }
    }

    _onResize() {
        this._videoSetSize();
    }
}

export default Video