import * as Marionette from 'backbone.marionette';
import {Video as VideoModel} from './models/Videos';
import VideoLayout from './views/VideoLayout';
import channels from '../../channels';

import './styles/videos.scss';

class VideosController extends Marionette.Object {
    init(region) {
        this._region = region;

        /** @type {VideoLayout} */
        this._videoLayout = null;
    }

    initVideo(videoId) {
        if (this._region.$el.find('.layout-video').length === 0) {
            const model = new VideoModel();

            this._videoLayout = new VideoLayout({ model });

            this._region.show(this._videoLayout);

            // Update breadcrumb
            this.listenTo(model, 'change:title', (videoModel, title) => {
                channels.breadcrumb.push({ title, type: 'video' });
            });
        }

        this._videoLayout.model.set('id', videoId);
    }
}

export default new VideosController();
