import * as Marionette from 'backbone.marionette'

import '../../../assets/css/videos.scss';

class VideosController extends Marionette.Object {
    init(region) {
        this._region = region;
    }

    initVideos() {
        this._region.empty();
    }
}

export default new VideosController();