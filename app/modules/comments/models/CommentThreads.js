import {Collection} from 'backbone'
import {Comment} from './Comments'
import {props} from '../../decorators'
import Config from '../../../Config'
import youtubeController from '../../youtube/controller'

class CommentThread extends Comment {
    @props({
        urlRoot: youtubeController.endpoints.commentThreads
    })

    /** @returns {{snippet: {channelId: (*|null), videoId: (*|null), topLevelComment: {snippet: {textOriginal: (string|*)}}}}} */
    getPayload() {
        let snippet = this.get('snippet');

        return {
            snippet: {
                channelId: snippet.channelId,
                videoId: snippet.videoId,
                topLevelComment: {
                    snippet: {
                        textOriginal: snippet.textOriginal
                    }
                }
            }
        };
    }
}

class CommentThreads extends Collection {
    @props({
        model: CommentThread,

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

export {CommentThread, CommentThreads}
export default CommentThreads