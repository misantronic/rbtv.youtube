import React from 'react';
import _ from 'underscore';
import CollectionLoader from '../../../behaviors/CollectionLoader';
import CollectionScrolling from '../../../behaviors/CollectionScrolling';
import moment from 'moment';
import ThumbComponent from '../../commons/Thumb';
import BtnWatchLater from '../../commons/BtnWatchLater';
import VideoCollection from '../../../../app/modules/videos/models/Videos';
import VideoModel from '../../../../app/modules/videos/models/Video';

class VideoListComponent extends React.Component {
    constructor(props) {
        super(props);

        _.bindAll(this, '_onCollectionUpdate', '_onFetchNext');

        const collection = this.props.collection.clone();

        this.state = { collection };

        this._refresh = _.debounce(() => this._fetch(true), 350);

        collection.listenTo(collection, 'sync reset', this._onCollectionUpdate);
    }

    /**
     * Lifecycle methods
     */

    render() {
        const collection = this.state.collection;

        return (
            <CollectionScrolling collection={collection} onUpdate={this._onFetchNext}>
                <CollectionLoader collection={collection}>
                    <div className="component-videolist items">
                        {collection.map(function (item) {
                            const videoId = item.get('videoId');
                            const image = item.get('thumbnails').high.url;
                            const description = item.get('description');
                            const title = item.get('title');
                            const publishedAt = moment(item.get('publishedAt'));

                            const duration = this.state['duration.' + videoId];

                            return (
                                <div className="item" key={item.id}>
                                    <ThumbComponent image={image} title={title} description={description} link={'#/video/' + videoId}
                                                    labelLeft={<span className="publishedAt label label-default">{publishedAt.fromNow()}</span>}
                                                    labelRight={<span className="duration label label-default">{VideoModel.humanizeDuration(duration)}</span>}>
                                        <BtnWatchLater id={videoId} type="video" />
                                    </ThumbComponent>
                                </div>
                            );
                        }, this)}
                    </div>
                </CollectionLoader>
            </CollectionScrolling>
        );
    }

    componentDidMount() {
        this._fetch();
    }

    componentDidUpdate(prevProps) {
        if (this._shouldInvalidate(prevProps)) {
            this._refresh();
        }
    }

    componentWillUnmount() {
        const collection = this.state.collection;

        collection.stopListening(collection, 'sync reset', this._onCollectionUpdate);
    }

    /**
     * Private methods
     */

    _shouldInvalidate(props) {
        return props.search !== this.props.search ||
            props.channel !== this.props.channel;
    }

    _fetch(reset = false) {
        const collection = this.state.collection;

        if (reset) {
            collection.reset();
        }

        if (collection.setQ) collection.setQ(this.props.search);
        if (collection.setChannelId) collection.setChannelId(this.props.channel);

        collection
            .fetch()
            .then(() => this._fetchVideos());
    }

    _fetchVideos() {
        const collection = this.state.collection;
        const videoCollection = new VideoCollection();

        const fetchedItems = collection.getFetchedItems ? collection.getFetchedItems() : collection;
        const videoIds = fetchedItems.map(item => item.get('videoId'));

        videoCollection.setVideoIds(videoIds);
        videoCollection
            .fetch()
            .then(() =>
                videoCollection.each(videoModel =>
                    this.setState({ ['duration.' + videoModel.id]: videoModel.get('duration') })
                )
            );
    }

    _onFetchNext() {
        const collection = this.state.collection;

        if (!collection.getNextPageToken || !collection.setNextPageToken) {
            return;
        }

        const token = collection.getNextPageToken();

        if (token) {
            collection.setNextPageToken(token);

            this._fetch();
        }
    }

    _onCollectionUpdate() {
        this.forceUpdate();
    }
}

export default VideoListComponent;
