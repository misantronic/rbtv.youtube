const React = require('react');
const _ = require('underscore');
const moment = require('moment');
const Backbone = require('backbone');
const storage = require('../../../utils/storage');
const CollectionLoader = require('../../../behaviors/CollectionLoader');
const CollectionScrolling = require('../../../behaviors/CollectionScrolling');
const ThumbComponent = require('../../commons/Thumb');
const TagsComponent = require('../../tags/Tags');
const BtnWatchLater = require('../../commons/BtnWatchLater');
const VideoCollection = require('../../../models/VideosCollection');
const VideoModel = require('../../../models/VideoModel');

class VideoListComponent extends React.Component {
    constructor(props) {
        super(props);

        _.bindAll(this, '_onCollectionUpdate', '_onFetchNext', '_onTagSelect');

        const collection = this.props.collection.clone();

        this.state = { collection };

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

                            const videoModel = this.state['video.' + videoId];
                            const videoInfo = storage.getVideoInfo(videoId);
                            let duration = '00:00';
                            let tags = [];
                            let itemClassName = 'item';

                            if (videoModel) {
                                duration = VideoModel.humanizeDuration(videoModel.get('duration'));
                                tags = videoModel.get('tags');
                            }

                            if (videoInfo.watched) {
                                itemClassName += ' is-watched';
                            }

                            return (
                                <div className={itemClassName} key={item.id}>
                                    <ThumbComponent image={image} title={title} description={description} link={'#/video/' + videoId}
                                                    labelLeft={<span className="duration label label-default">{duration}</span>}
                                                    labelRight={<span className="publishedAt label label-default">{publishedAt.fromNow()}</span>}>
                                        <BtnWatchLater id={videoId} type="video"/>
                                        <TagsComponent tags={tags} onTagSelect={this._onTagSelect}/>
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
            this._fetch(true);
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

        if (videoIds.length === 0) return;

        videoCollection.setVideoIds(videoIds);
        videoCollection
            .fetch()
            .then(() => {
                this.setState(
                    videoCollection.reduce(function (memo, videoModel) {
                        memo['video.' + videoModel.id] = videoModel;

                        return memo;
                    }, {})
                );
            });
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

    _onTagSelect(tagValue) {
        if (this.props.onTagSelect) {
            this.props.onTagSelect(tagValue);
        }
    }
}

VideoListComponent.propTypes = {
    collection: React.PropTypes.object,
    channel: React.PropTypes.string,
    search: React.PropTypes.string
};

module.exports = VideoListComponent;
