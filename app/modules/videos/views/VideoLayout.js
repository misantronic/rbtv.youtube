import _ from 'underscore';
import {LayoutView} from 'backbone.marionette';
import app from '../../../application';
import {localStorage, stringUtil} from '../../../utils';
import {props} from '../../decorators';
import RelatedResults from '../../search/views/RelatedResults';
import RelatedResultsCollection from '../../search/models/RelatedResults';
import PlaylistItems from '../../playlistsDetails/views/PlistlistItems';
import commentsController from '../../comments/controller';
import PlaylistItemsCollection from '../../playlistsDetails/models/PlaylistItems';
import ThumbsView from '../../thumbs/views/Thumbs';
import VideoPlayerView from './VideoPlayer';

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
            BtnToTop: {},
            Loader: {
                container: '.loader-container'
            }
        }
    })

    get isPlaylist() {
        return !!this.model.get('playlistId');
    }

    modelEvents() {
        return {
            'change:title': (model, title) => this.ui.title.text(title),

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
                this.ui.publishedAt.text(publishedAt.format('LLLL'));
            },

            'change:statistics': (model, statistics) => {
                const views = statistics.viewCount;

                this.ui.views.text(stringUtil.formatNumber(views));
            },

            'change:description': (model, description) => {
                this.ui.description.html(description);
            }
        };
    }

    _initVideo() {
        const videoId = this.model.get('id');

        if (!this._videoPlayer) {
            this._videoPlayer = new VideoPlayerView({ videoId });

            this.listenTo(this._videoPlayer, 'video:ended', this._setWatched);
            this.listenTo(this._videoPlayer, 'video:ended', _.debounce(this._playNext, 0));

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
        const videoId = this.model.id;
        const channelId = this.model.get('channelId');
        const collection = new RelatedResultsCollection();

        collection
            .setChannelId(channelId)
            .setRelatedToVideoId(videoId);

        this.collection = collection;

        const view = new RelatedResults({ collection });

        this.listenTo(view, 'childview:link:clicked', itemView => {
            const itemViewVideoId = itemView.model.get('videoId');

            app.navigate(`video/${itemViewVideoId}`);
        });

        this.getRegion('playlist').show(view);

        collection.fetch();
    }

    _initPlaylistItems() {
        const playlistId = this.model.get('playlistId');
        const collection = this.getOption('collection') || new PlaylistItemsCollection();

        this._playlistItemsView = new PlaylistItems({ collection });

        this.getRegion('playlist').show(this._playlistItemsView);

        this.listenTo(this._playlistItemsView, 'childview:link:clicked', playlistItemView => {
            const videoId = playlistItemView.model.get('videoId');

            this._selectVideo(videoId);
        });

        this.collection = collection;

        if (collection.length === 0) {
            this._playlistItemsView.loading = true;

            collection.playlistId = playlistId;

            // Check cache for playlistItems
            return this.collection.fetch()
                .done(() => {
                    this._playlistItemsView.loading = false;

                    this._autoselectVideo();
                });
        } else {
            this._autoselectVideo();
        }
    }

    _initComments() {
        commentsController.init(this.getRegion('comments'));
        commentsController.initComments(this.model);
    }

    _playNext() {
        if (!this.isPlaylist) return;

        const videoId = this.model.id;
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

        const playlistItem = this.collection.getCurrentPlaylistItem(videoId);

        if (playlistItem) {
            playlistItem.set('_watched', true);
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

    _autoselectVideo() {
        const videoId = this.model.id || this.collection.first().get('videoId');

        this._selectVideo(videoId);
    }
}

export default Video;
