import React from 'react';
import VideoModel from '../../../datasource/models/VideoModel';
import VideoPlayer from '../player/VideoPlayer';
import Thumbs from './Thumbs';
import numbers from '../../../utils/numbers';

class VideoDetails extends React.Component {
    constructor(props, context) {
        super(props, context);

        const { id, seekTo } = props;

        this.state = {
            videoModel: new VideoModel({ id }),
            seekTo
        };
    }

    /**
     * Lifecycle methods
     */

    render() {
        const model = this.state.videoModel;

        const videoId = model.id || null;
        const { title, description, publishedAt, statistics, liveStreamingDetails } = model.attributes;

        let viewers = '';

        if (liveStreamingDetails) {
            viewers = `${numbers.format(liveStreamingDetails.concurrentViewers)} viewers`;
        } else {
            viewers = `${numbers.format(statistics.viewCount)} views`;
        }

        return (
            <div className="component-videodetails">
                <div className="row">
                    <div className="col-xs-12">
                        <VideoPlayer id={videoId} autoplay={this.state.autoplay} seekTo={this.props.seekTo}/>
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
                            <div className="col-xs-8">
                                <h4>Published on {publishedAt && publishedAt.format('LL')}</h4>
                            </div>
                            <div className="col-xs-4 text-right">
                                <h4 className="views">{viewers}</h4>
                                <Thumbs statistics={statistics} id={videoId}/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-12">
                                {description.split('\n').map((item, i) => <span key={i}>{item}<br/></span>)}
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

        if (this._propHasChanged(prevProps, 'seekTo')) {
            this.setState({ seekTo: this.props.seekTo });
        }
    }

    componentWillUnmount() {
        if (this._xhr) {
            this._xhr.abort();
        }
    }

    /**
     * Private methods
     */

    _propHasChanged(prevProps, prop) {
        return prevProps[prop] !== this.props[prop];
    }

    _fetch() {
        const { id, fromCache, liveStreamingDetails } = this.props;
        const model = this.state.videoModel;

        if (id) {
            model.set({ id });
            this._xhr = model.fetch({ fromCache, liveStreamingDetails });
            this._xhr.then(() => {
                this.forceUpdate();

                if (this.props.onFetch) {
                    this.props.onFetch(model);
                }
            });
        }
    }
}

VideoDetails.defaultProps = {
    fromCache: true,
    liveStreamingDetails: false
};

module.exports = VideoDetails;
