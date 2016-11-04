import React from 'react';
import {Component} from 'react';
import moment from 'moment';

class VideoListItemComponent extends Component {
    render() {
        const item = this.props.item;
        const index = this.props.index;
        const videoId = item.get('videoId');
        const thumb = item.get('thumbnails').high.url;
        const description = item.get('description');
        const title = item.get('title');
        const publishedAt = moment(item.get('publishedAt'));

        return (
            <div className="item">
                <div className="thumbnail">
                    <a className="link js-link" href={'#video/' + videoId}>
                        <img className="thumb" src={thumb}/>
                        <span className="publishedAt label label-default">{publishedAt.fromNow()}</span>
                        <span className="duration label label-default"></span>
                    </a>
                    <div className="caption">
                        <h3 className="title">
                            <a className="js-link" href={'#video/' + videoId}>{title}</a>
                        </h3>
                        <p className="description">{description}</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default VideoListItemComponent;
