import _ from 'underscore';
import React from 'react';
import {connect} from 'react-redux';
import Thumb from '../../commons/Thumbnail';
import Tags from '../../tags/Tags';
import BtnWatchLater from '../../commons/BtnWatchLater';
import numbers from '../../../utils/numbers';

@connect(state => ({ videoItems: state.videos.items }))
class VideoListItem extends React.Component {
    constructor() {
        super();

        _.bindAll(this, '_onTagSelect');

        this.state = {
            isTransparent: true
        };
    }

    render() {
        const { item, fadeIndex } = this.props;
        const videoDetails = this._getVideoDetails(item);

        let className = 'component-video-list-item item item-t-' + fadeIndex;

        if (videoDetails.watched) {
            className += ' is-watched';
        }

        if (this.state.isTransparent) {
            className += ' is-transparent';

            _.delay(() => this.setState({ isTransparent: false }), 0);
        }

        return (
            <div className={className} key={videoDetails.id} ref={this._onItem}>
                <Thumb image={videoDetails.image} title={videoDetails.title} description={videoDetails.description} link={'#/video/' + videoDetails.videoId}
                       labelLeft={<span className="duration label label-default">{videoDetails.duration}</span>}
                       labelRight={<span className="published-at label label-default">{videoDetails.publishedAt.fromNow()}</span>}>
                    <BtnWatchLater id={videoDetails.videoId} type="video"/>
                    <Tags tags={videoDetails.tags} onTagSelect={this._onTagSelect}/>
                </Thumb>
            </div>
        );
    }

    /**
     * @param {object} item
     * @returns {{videoId: string, image: string, description: string, title: string, publishedAt: moment, duration: string, watched: boolean, tags: Array}}
     * @private
     */
    _getVideoDetails(item) {
        const videoId = item.videoId;
        const videoItem = _.findWhere(this.props.videoItems, { videoId });

        let videoInfo = {};
        let duration = '00:00';

        if (videoItem) {
            videoInfo = videoItem.videoInfo;
            duration = numbers.humanizeDuration(videoItem.duration);
        }

        return {
            id: item.id,
            videoId,
            image: item.snippet.thumbnails.high.url,
            description: item.snippet.description,
            title: item.snippet.title,
            publishedAt: item.snippet.publishedAt,
            duration,
            watched: videoInfo.watched,
            tags: videoInfo.tags || []
        };
    }

    _onTagSelect(tagValue) {
        this.props.onTagSelect(tagValue);
    }
}

VideoListItem.propTypes = {
    item: React.PropTypes.object.isRequired,
    videoItems: React.PropTypes.array,
    onTagSelect: React.PropTypes.func,
    fadeIndex: React.PropTypes.number
};

VideoListItem.defaultProps = {
    onTagSelect: _.noop
};

export default VideoListItem;
