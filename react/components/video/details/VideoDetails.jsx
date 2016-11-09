import React from 'react';
import VideoModel from '../../../../app/modules/videos/models/Video';

class VideoDetailsComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            videoModel: new VideoModel({ id: this.props.id })
        };
    }

    /**
     * Lifecycle methods
     */

    render() {
        const model = this.state.videoModel;
        const title = model.get('title');

        return (
            <div className="component-videodetails">
                <h1>{title}</h1>
            </div>
        );
    }

    componentDidMount() {
        this._fetch();
    }

    componentDidUpdate(prevProps) {
        if (this._propHasChanged(prevProps, 'id')) {
            this._fetch();
        }
    }

    /**
     * Private methods
     */

    _propHasChanged(prevProps, prop) {
        return prevProps[prop] !== this.props[prop];
    }

    _fetch() {
        const id = this.props.id;
        const model = this.state.videoModel;

        if (id) {
            model
                .set({ id })
                .fetch()
                .then(() => this.forceUpdate());
        }
    }
}

export default VideoDetailsComponent;
