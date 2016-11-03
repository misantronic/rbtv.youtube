import React from 'react';
import {Component} from 'react';
import moment from 'moment';

import Thumb from './Thumb';
import Caption from './Caption';

class VideoListItem extends Component {
    render() {
        const item = this.props.item;
        const index = this.props.index;
        const videoId = item.get('videoId');
        const thumb = item.get('thumbnails').high.url;
        const description = item.get('description');
        const title = item.get('title');
        const publishedAt = moment(item.get('publishedAt'));

        return (
            <div key={item.id} className="item">
                <div className="thumbnail">
                    <Thumb videoId={videoId} thumb={thumb} publishedAt={publishedAt}/>
                    <Caption videoId={videoId} description={description} title={title}/>
                </div>
            </div>
        );
    }
}

export default VideoListItem;
