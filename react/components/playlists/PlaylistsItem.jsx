import React from 'react';
import {Component} from 'react';
import ThumbComponent from '../commons/Thumb';
import ButtonWatchLater from '../commons/ButtonWatchLater';

class PlaylistItemComponent extends Component {
    render() {
        const item = this.props.item;

        const title = item.get('title');
        const description = item.get('description');
        const itemCount = item.get('itemCount');
        const channelId = item.get('channelId');
        const image = item.get('thumbnails').high.url;

        return (
            <div className="item">
                <ThumbComponent
                    link={'#/playlists/' + channelId}
                    title={title}
                    description={description}
                    image={image}
                    badge={<span className="badge">{itemCount}</span>}>
                    <ButtonWatchLater id={item.id} type="playlist"/>
                </ThumbComponent>
            </div>
        );
    }
}

export default PlaylistItemComponent;
