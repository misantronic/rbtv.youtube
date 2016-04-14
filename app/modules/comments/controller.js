import * as Marionette from 'backbone.marionette'
import CommentsCollection from './models/Comments'
import CommentsView from './views/Comments'

import '../../../assets/css/comments.scss';

class Controller extends Marionette.Object {
    init(region) {
        this._region = region;
    }

    initComments(videoId) {
        const view = new CommentsView({ collection: new CommentsCollection() });

        this._region.show(view);

        view.collection.setVideoId(videoId);
    }
}

export default new Controller();