import * as Marionette from 'backbone.marionette'
import {Video as VideoModel} from './models/Videos'
import VideoView from './views/Video'
import channels from '../../channels'

import '../../../assets/css/videos.scss';

class VideosController extends Marionette.Object {
    init(region) {
        this._region = region;
    }

    initVideo(videoId) {
        if (this._region.$el.find('.layout-video').length === 0) {
            let model = new VideoModel();

            this._videoView = new VideoView({ model: model });

            this._region.show(this._videoView);

            // Update breadcrumb
            this.listenTo(model, 'change:title', (model, title) => {
                channels.breadcrumb.push(title);
            });
        }

        this._videoView.model.set('id', videoId);
    }
}

export default new VideosController();