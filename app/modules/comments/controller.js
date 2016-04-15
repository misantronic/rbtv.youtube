import * as Marionette from 'backbone.marionette'
import CommentsCollection from './models/Comments'
import CommentsView from './views/Comments'

import '../../../assets/css/comments.scss';

class Controller extends Marionette.Object {
    init(region) {
        this._region = region;
    }

    initComments(videoId, channelId) {
        const collection = new CommentsCollection();
        const view       = new CommentsView({ videoId, channelId, collection });

        view.collection.videoId = videoId;

        this._region.show(view);
    }
}

export default new Controller();