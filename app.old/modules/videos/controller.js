import * as Marionette from 'backbone.marionette';
import * as $ from 'jquery';
import channels from '../../channels';

import VideoLayout from './views/VideoLayout';
import VideoModel from './models/Video';

import './styles/videos.scss';

const VideosController = Marionette.Object.extend({
    /** @type {VideoLayout} */
    _videoLayout: null,

    init(region) {
        this._region = region;
    },

    initVideo(videoId) {
        /** @type {VideoModel} */
        let model;

        // TODO: this is a workaround, find a better way to solve this
        // Is true when the video-route is initially called. when clicked on an item in a playlist, the value is false
        if (this._region.$el.find('.layout-video').length === 0) {
            model = new VideoModel();

            this._videoLayout = new VideoLayout({ model });

            // const interval = setInterval(() => {
            //     console.log(interval, $('.region-videoplayer').height());
            // }, 10);

            this._region.show(this._videoLayout);

            // Update breadcrumb
            this.listenTo(
                model,
                'change:title',
                (noop, title) => channels.breadcrumb.push({ title, type: 'video' })
            );
        } else {
            model = this._videoLayout.model;
        }

        model.set('id', videoId);
    }
});

export default new VideosController();
