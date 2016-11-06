import React from 'react';
import {Component} from 'react';
import moment from 'moment';
import ThumbComponent from '../commons/Thumb';
import ButtonWatchLater from '../commons/ButtonWatchLater';

class VideoListItemComponent extends Component {
    render() {
        const item = this.props.item;
        const videoId = item.get('videoId');
        const image = item.get('thumbnails').high.url;
        const description = item.get('description');
        const title = item.get('title');
        const publishedAt = moment(item.get('publishedAt'));

        return (
            <div className="item">
                <ThumbComponent image={image} title={title} description={description} link={'#/video/' + videoId}
                                labelLeft={<span className="publishedAt label label-default">{publishedAt.fromNow()}</span>}
                                labelRight={<span className="duration label label-default"></span>}>
                    <ButtonWatchLater id={videoId} type="video" />
                </ThumbComponent>
            </div>
        );
    }
}

export default VideoListItemComponent;
