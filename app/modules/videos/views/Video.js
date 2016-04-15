import _ from 'underscore'
import $ from 'jquery'
import {LayoutView} from 'backbone.marionette'
import app from '../../../application'
import {localStorage} from '../../../utils'
import {props} from '../../decorators'
import RelatedResults from '../../search/views/RelatedResults'
import RelatedResultsCollection from '../../search/models/RelatedResults'
import PlaylistItems from '../../playlists/views/PlistlistItems'
import PlaylistItemsCollection from '../../playlists/models/PlaylistItems'
import youtubeController from '../../youtube/controller'
import commentsController from '../../comments/controller'
import BehaviorBtnToTop from '../../../behaviors/btnToTop/BtnToTop'

let autoplay = false;

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
            dislikes: '.js-count-dislikes',
            btnLike: '.js-btn-like',
            btnDislike: '.js-btn-dislike'
        },

        events: {
            'click @ui.btnLike': '_onClickLike',

            'click @ui.btnDislike': '_onClickDislike'
        },

        regions: {
            playlist: '.region-playlist',
            comments: '.region-comments'
        },

        behaviors: {
            BtnToTop: {
                behaviorClass: BehaviorBtnToTop
            }
        }
    })

    get isPlaylist() {
        return !!this.model.get('playlistId');
    }

    modelEvents() {
        return {
            'change:title': (model, title) => {
                this.ui.title.text(title)
            },

            'change:id': () => {
                if (!this.model.get('id')) return;

                this.model
                    .set('_loading', true)
                    .fetchLive()
                    .then(() => {
                        this._initVideo();
                        this._initRatings();

                        if (!this.isPlaylist) {
                            this._initRelatedVideos();
                        }

                        this._initComments();

                        this.model.set('_loading', false);
                    });
            },

            'change:playlistId': '_initPlaylistItems',

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
            },

            'change:_liked': (model, val) => {
                if (val) {
                    this.ui.btnLike.addClass('active');
                } else {
                    this.ui.btnLike.removeClass('active');
                }
            },

            'change:_disliked': (model, val) => {
                if (val) {
                    this.ui.btnDislike.addClass('active');
                } else {
                    this.ui.btnDislike.removeClass('active');
                }
            }
        }
    }

    initialize() {
        _.bindAll(this, '_initVideo', '_onRated', '_onVideoReady', '_onVideoStateChange');

        this._playerInterval = 0;

        this.listenTo(app.channel, 'resize', _.debounce(this._onResize, 100));
    }

    onShow() {
        this._videoSetSize();
    }

    _initVideo() {
        clearInterval(this._playerInterval);

        const videoId = this.model.id;

        if (!videoId) return;

        if (this._player && this._player.cueVideoById) {
            // currentTime
            const videoInfo   = localStorage.get(`${videoId}.info`) || {};
            const currentTime = videoInfo.currentTime || 0;

            if (autoplay) {
                this._player.loadVideoById(videoId, currentTime);
            } else {
                this._player.cueVideoById(videoId, currentTime);
            }
        } else {
            let containerId = 'yt-video-container';
            let container   = this.$('#' + containerId);
            let height      = container.css('height', 'auto').height();
            let $container  = $('<div id="' + containerId + '"></div>');

            if (height) {
                $container.css('height', height)
            }

            container.replaceWith($container);

            var initPlayer = function () {
                this._player = new YT.Player(containerId, {
                    width: '100%',
                    height: '100%',
                    videoId: videoId,
                    events: {
                        'onReady': this._onVideoReady,
                        'onStateChange': this._onVideoStateChange
                    }
                });

                this._videoSetSize();
            }.bind(this);

            if (typeof YT === 'undefined' || !YT.Player) {
                window.onYouTubeIframeAPIReady = initPlayer;
            } else {
                initPlayer();
            }
        }
    }

    _initRelatedVideos() {
        const videoId    = this.model.id;
        const channelId  = this.model.get('channelId');
        const collection = new RelatedResultsCollection();

        collection
            .setChannelId(channelId)
            .setRelatedToVideoId(videoId);

        this.collection = collection;

        var view = new RelatedResults({
            collection: collection
        });

        this.listenTo(view, 'childview:link:clicked', view => {
            let videoId = view.model.get('videoId');

            app.navigate(`video/${videoId}`);
        });

        this.getRegion('playlist').show(view);

        collection.fetch();
    }

    _initPlaylistItems() {
        let playlistId = this.model.get('playlistId');

        this.collection         = new PlaylistItemsCollection();
        this._playlistItemsView = new PlaylistItems({ collection: this.collection });

        this.getRegion('playlist').show(this._playlistItemsView);

        this.listenTo(this._playlistItemsView, 'childview:link:clicked', playlistItemView => {
            let videoId = playlistItemView.model.get('videoId');

            this._selectVideo(videoId);
        });

        this._playlistItemsView.loading = true;

        this.collection.playlistId = playlistId;

        // Check cache for playlistItems
        return this.collection.fetch()
            .done(() => {
                this._playlistItemsView.loading = false;

                let videoId = this.model.id || this.collection.first().get('videoId');

                this._selectVideo(videoId);
            });
    }

    _initComments() {
        commentsController.init(this.getRegion('comments'));
        commentsController.initComments(this.model);
    }

    _selectVideo(videoId) {
        if (this._playlistItemsView) {
            this._playlistItemsView.videoId = videoId;
        }

        // Update own id -> load video
        this.model.set('id', videoId);
    }

    _setWatched() {
        const videoId = this.model.id;

        var playlistItem = this.collection.getCurrentPlaylistItem(videoId);

        if (playlistItem) {
            playlistItem.set('_watched', true)
        }

        localStorage.update(`${videoId}.info`, { watched: true, currentTime: 0 });
    }

    _playNext() {
        const videoId          = this.model.id;
        const nextPlaylistItem = this.collection.getNextPlaylistItem(videoId);

        if (nextPlaylistItem) {
            const nextVideoId = nextPlaylistItem.get('videoId');

            // Reset currentTime
            localStorage.update(`${nextVideoId}.info`, { currentTime: 0 });

            // Set new videoId
            this._selectVideo(nextVideoId);

            // Start video automatically
            autoplay = true;
        }
    }

    _initRatings() {
        const videoId = this.model.id;

        youtubeController.getRating(videoId, function (rating) {
            this.model.set({
                _liked: rating === 'like',
                _disliked: rating === 'dislike'
            });
        }.bind(this));
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
        const videoId = this.model.id;

        // Mark as watched
        this._setWatched();

        // Play next when video is playlist
        if (this.isPlaylist) {
            this._playNext();
        }
    }

    _onVideoReady(e) {
        if (_.isNull(e.data)) {
            this._onResize();
        }
    }

    _videoSetSize() {
        let width  = this.ui.video.width();
        let height = width * 0.51;

        if (window.innerWidth <= 768) {
            width  = '100%';
            height = window.innerWidth * 0.51;
        }

        this.ui.video.css({ width, height });
    }

    _onVideoStateChange(e) {
        const videoId = this.model.id;

        switch (e.data) {
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

    _onClickLike() {
        let rating = this.model.get('_liked') ? 'none' : 'like';

        youtubeController
            .addRating(rating, this.model.id)
            .done(this._onRated);
    }

    _onClickDislike() {
        let rating = this.model.get('_disliked') ? 'none' : 'dislike';

        youtubeController
            .addRating(rating, this.model.id)
            .done(this._onRated);
    }

    _onRated(rating) {
        let liked      = rating === 'like';
        let disliked   = rating === 'dislike';
        let none       = rating === 'none';
        let statistics = this.model.get('statistics');

        if (liked) {
            statistics.likeCount++;

            if (this.model.get('_disliked')) {
                statistics.dislikeCount--;
            }
        }

        if (disliked) {
            statistics.dislikeCount++;

            if (this.model.get('_liked')) {
                statistics.likeCount--;
            }
        }

        if (none) {
            if (this.model.get('_liked')) {
                statistics.likeCount--;
            }

            if (this.model.get('_disliked')) {
                statistics.dislikeCount--;
            }
        }

        this.model
            .set({
                _liked: liked,
                _disliked: disliked,
                statistics: statistics
            })
            // Manually trigger change on statistics
            .trigger('change:statistics', this.model, statistics);
    }
}

export default Video