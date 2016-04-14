import {Model, Collection} from 'backbone'
import {props} from '../../decorators'
import Config from '../../../Config'
import moment from 'moment';

class Comment extends Model {
    parse(response) {
        return {
            id: response.id,
            kind: response.kind,
            etag: response.etag,
            videoId: response.snippet.videoId,
            canReply: response.snippet.canReply,
            totalReplyCount: response.snippet.totalReplyCount,
            isPublic: response.snippet.isPublic,
            topLevelComment: {
                id: response.snippet.topLevelComment.id,
                kind: response.snippet.topLevelComment.kind,
                etag: response.snippet.topLevelComment.etag,
                author: {
                    displayName: response.snippet.topLevelComment.snippet.authorDisplayName,
                    profileImageUrl: response.snippet.topLevelComment.snippet.authorProfileImageUrl,
                    channelUrl: response.snippet.topLevelComment.snippet.authorChannelUrl,
                    channelId: response.snippet.topLevelComment.snippet.authorChannelId.value,
                    googlePlusProfileUrl: response.snippet.topLevelComment.snippet.authorGoogleplusProfileUrl
                },
                videoId: response.snippet.topLevelComment.snippet.videoId,
                textDisplay: response.snippet.topLevelComment.snippet.textDisplay,
                canRate: response.snippet.topLevelComment.snippet.canRate,
                viewerRating: response.snippet.topLevelComment.snippet.viewerRating,
                likeCount: response.snippet.topLevelComment.snippet.likeCount,
                publishedAt: moment(response.snippet.topLevelComment.snippet.publishedAt),
                updatedAt: moment(response.snippet.topLevelComment.snippet.updatedAt)
            }
        }
    }
}

class Comments extends Collection {
    @props({
        model: Comment,

        url: function () {
            return `${Config.endpoints.comments}?videoId=${this._videoId}&pageToken=${this._pageToken}`;
        },

        _pageToken: '',

        _videoId: ''
    })

    setVideoId(val) {
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

export {Comment, Comments}
export default Comments