import {LayoutView} from 'backbone.marionette'
import app from '../../../application'
import {localStorage} from '../../../utils'
import {props} from '../../decorators'
import RelatedResults from '../../search/views/RelatedResults'
import RelatedResultsCollection from '../../search/models/RelatedResults'
import PlaylistItems from '../../playlists/views/PlistlistItems'
import commentsController from '../../comments/controller'
import PlaylistItemsCollection from '../../playlists/models/PlaylistItems'
import BehaviorBtnToTop from '../../../behaviors/btnToTop/BtnToTop'
import ThumbsView from '../../thumbs/views/Thumbs'
import VideoPlayerView from './VideoPlayer'

class Video extends LayoutView {
    @props({
        className: 'layout-video',

        template: require('../templates/video.ejs'),

        ui: {
            title: '.js-title',
            video: '.js-video-container',
            publishedAt: '.js-publishedAt',
            views: '.js-views',
            description: '.js-description'
        },

        regions: {
            videoplayer: '.region-videoplayer',
            playlist: '.region-playlist',
            comments: '.region-comments',
            thumbs: '.region-thumbs'
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
                        this._initThumbs();

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
                let views = statistics.viewCount;

                this.ui.views.text(views);
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

    _initVideo() {
        const videoId = this.model.get('id');

        if (!this._videoPlayer) {
            this._videoPlayer = new VideoPlayerView({ videoId });

            this.listenTo(this._videoPlayer, 'video:ended', this._playNext);
            this.listenTo(this._videoPlayer, 'video:ended', this._setWatched);
            
            this.getRegion('videoplayer').show(this._videoPlayer);
        } else {
            this._videoPlayer.videoId = videoId;
        }
    }

    _initThumbs() {
        const statistics = this.model.get('statistics');

        this.getRegion('thumbs').show(
            new ThumbsView({
                resourceId: this.model.id,
                hideLikes: false,
                hideDislikes: false,
                likeCount: statistics.likeCount,
                dislikeCount: statistics.dislikeCount,
                checkOwnRating: true,
                canRate: true
            })
        );
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

    _playNext() {
        if (!this.isPlaylist) return;

        const videoId          = this.model.id;
        const nextPlaylistItem = this.collection.getNextPlaylistItem(videoId);

        if (nextPlaylistItem) {
            const nextVideoId = nextPlaylistItem.get('videoId');

            // Reset currentTime
            localStorage.update(`${nextVideoId}.info`, { currentTime: 0 });

            // Start video automatically
            this._videoPlayer.autoplay = true;

            // Set new videoId
            this._selectVideo(nextVideoId);
        }
    }

    _setWatched() {
        const videoId = this.model.id;

        var playlistItem = this.collection.getCurrentPlaylistItem(videoId);

        if (playlistItem) {
            playlistItem.set('_watched', true)
        }

        localStorage.update(`${videoId}.info`, { watched: true, currentTime: 0 });
    }

    _selectVideo(videoId) {
        this.model.set('id', videoId);

        if (this._playlistItemsView) {
            this._playlistItemsView.videoId = videoId;
        }

        // Update own id -> load video
        this._initVideo();
    }
}

export default Video