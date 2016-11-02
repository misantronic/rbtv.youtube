import React from 'react';
import {Component} from 'react';
import moment from 'moment';

import Thumb from './Thumb';
import Caption from './Caption';

class Item extends Component {
    constructor(props) {
        super(props);

        this._onClick = this._onClick.bind(this);

        this.state = {
            watched: false
        };
    }

    render() {
        const item = this.props.item;
        const videoId = item.get('videoId');
        const thumb = item.get('thumbnails').high.url;
        const description = item.get('description');
        const title = item.get('title');
        const publishedAt = moment(item.get('publishedAt'));

        const className = this._getClassName();

        return (
            <div key={item.id} className={className} onClick={this._onClick}>
                <div className="thumbnail">
                    <Thumb videoId={videoId} thumb={thumb} publishedAt={publishedAt}/>
                    <Caption videoId={videoId} description={description} title={title}/>
                </div>
            </div>
        );
    }

    _getClassName() {
        const index = this.props.index;

        let className = 'item col-xs-12 col-sm-4 collection-item collection-item-t-' + index;

        if (this.state.watched) {
            className += ' watched';
        }

        return className;
    }

    _onClick() {
        this.setState({
            watched: !this.state.watched
        });
    }
}

export default Item;
