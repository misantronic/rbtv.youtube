import _ from 'underscore';
import youtubeController from '../../utils/youtubeController';
import CommentModel from './CommentModel';

/**
 * @class CommentThreadModel
 */
module.exports = CommentModel.extend({
    urlRoot: youtubeController.endpoints.commentThreads,

    /** @returns {{snippet: {channelId: (*|null), videoId: (*|null), topLevelComment: {snippet: {textOriginal: (string|*)}}}}} */
    getPayload() {
        const snippet = this.get('snippet');

        return {
            id: this.id,
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
});
