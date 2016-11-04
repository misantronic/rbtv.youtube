import React from 'react';
import {Component} from 'react';

class PlaylistsItem extends Component {
    render() {
        const item = this.props.item;
        const index = this.props.index;

        const title = item.get('title');
        const description = item.get('description');
        const itemCount = item.get('itemCount');
        const channelId = item.get('channelId');
        const thumb = item.get('thumbnails').high.url;

        return (
            <div className="item">
                <div className="thumbnail">
                    <a className="link" href={'#playlists/' + channelId}>
                        <img className="thumb" src={thumb}/>
                    </a>
                    <div className="caption">
                        <h3 className="title" title={title}>
                            <a className="link" href={'#playlists/' + channelId}>{title}</a>
                            <span className="badge">{itemCount}</span>
                        </h3>
                        <p className="description">{description}</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default PlaylistsItem;
