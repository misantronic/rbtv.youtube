import React from 'react';
import Thumb from '../commons/Thumbnail';
import BtnWatchLater from '../commons/BtnWatchLater';

class PlaylistListItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isTransparent: true
        };
    }

    render() {
        const {id, image, title, description, itemCount} = this.props.item;
        const fadeIndex = this.props.fadeIndex;

        let className = 'component-playlist-list-item item item-t-' + fadeIndex;

        if (this.state.isTransparent) {
            className += ' is-transparent';

            _.delay(() => this.setState({ isTransparent: false }), 0);
        }

        return (
            <div className={className}>
                <Thumb
                    link={'#/playlists/' + id}
                    title={title}
                    description={description}
                    image={image}
                    badge={<span className="badge">{itemCount}</span>}>
                    <BtnWatchLater id={id} type="playlist"/>
                </Thumb>
            </div>
        );
    }
}

export default PlaylistListItem;
