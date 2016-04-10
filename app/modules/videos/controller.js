import * as Marionette from 'backbone.marionette'
import {Video as VideoModel} from './models/Videos'
import VideoView from './views/Video'

import '../../../assets/css/videos.scss';

class VideosController extends Marionette.Object {
    init(region) {
        this._region = region;
    }

    initVideo(videoId) {
        if (this._region.$el.find('.layout-video').length === 0) {
            this._videoView = new VideoView({ model: new VideoModel() });

            this._region.show(this._videoView);
        }

        this._videoView.model.set('id', videoId);
    }
}

export default new VideosController();