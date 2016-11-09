import React from 'react';
import VideoModel from '../../../../app/modules/videos/models/Video';
import VideoPlayer from '../player/VideoPlayer';
import numbers from '../../../utils/numbers';

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
        const videoId = model.id;
        const title = model.get('title');
        const desc = model.get('description');
        const publishedAt = model.get('publishedAt');
        const views = model.get('statistics').viewCount;

        console.log(model.toJSON());

        return (
            <div className="component-videodetails">
                <div className="row">
                    <div className="col-xs-12">
                        <VideoPlayer id={videoId} autoplay={this.state.autoplay}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12">
                        <h1 title={title}>{title}</h1>
                    </div>
                </div>
                <div className="row details-wrapper">
                    <div className="col-sm-7 col-xs-12">
                        <div className="row">
                            <div className="col-xs-6">
                                Published on {publishedAt && publishedAt.format('LL')}
                            </div>
                            <div className="col-xs-6 text-right">
                                {numbers.format(views)} views
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-12">
                                {desc.split('\n').map((item, i) => <span key={i}>{item}<br/></span>)}
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-5 col-xs-12">
                        {this.props.children}
                    </div>
                </div>
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
        const method = this.props.fromCache ? 'fetch' : 'fetchLive';

        if (id) {
            model.set({ id });
            model[method]().then(() => this.forceUpdate());
        }
    }
}

VideoDetailsComponent.defaultProps = {
    fromCache: true
};

export default VideoDetailsComponent;
