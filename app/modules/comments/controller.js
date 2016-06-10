import * as Marionette from 'backbone.marionette'
import CommentThreadsCollection from './models/CommentThreads'
import CommentsLayout from './views/CommentsLayout'

import '../../../assets/css/modules/comments.scss';

class Controller extends Marionette.Object {
    init(region) {
        this._region = region;
    }

    initComments(videoModel) {
        const view = new CommentsLayout({
            videoId: videoModel.id,
            channelId: videoModel.get('channelId'),
            statistics: videoModel.get('statistics'),
            collection: new CommentThreadsCollection()
        });

        view.collection.videoId = videoModel.id;

        this._region.show(view);
    }
}

export default new Controller();