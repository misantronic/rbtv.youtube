import {Collection} from 'backbone'
import {Comment} from './Comments'
import {props} from '../../decorators'
import Config from '../../../Config'

class CommentThreads extends Collection {
    @props({
        model: Comment,

        url: function () {
            return `${Config.endpoints.commentThreads}?videoId=${this._videoId}&pageToken=${this._pageToken}`;
        },

        _pageToken: '',

        _videoId: ''
    })

    set videoId(val) {
        this._videoId = val;
    }

    get pageToken() {
        return this._pageToken
    }

    parse(response) {
        this._pageToken = response.nextPageToken || null;

        return this.models.concat(response.items);
    }
}

export {CommentThreads}
export default CommentThreads