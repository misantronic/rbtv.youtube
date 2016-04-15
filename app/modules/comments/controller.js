import * as Marionette from 'backbone.marionette'
import CommentsCollection from './models/Comments'
import CommentsView from './views/Comments'

import '../../../assets/css/comments.scss';

class Controller extends Marionette.Object {
    init(region) {
        this._region = region;
    }

    initComments(videoModel) {
        const view = new CommentsView({
            videoId: videoModel.id,
            channelId: videoModel.get('channelId'),
            statistics: videoModel.get('statistics'),
            collection: new CommentsCollection()
        });

        view.collection.videoId = videoModel.id;

        this._region.show(view);
    }
}

export default new Controller();