const React = require('react');
const _ = require('underscore');
const $ = require('jquery');
const moment = require('moment');
const storage = require('../../../utils/storage');
const CollectionLoader = require('../../../behaviors/CollectionLoader');
const CollectionScrolling = require('../../../behaviors/CollectionScrolling');
const ThumbComponent = require('../../commons/Thumbnail');
const TagsComponent = require('../../tags/Tags');
const BtnWatchLater = require('../../commons/BtnWatchLater');
const VideoCollection = require('../../../datasource/collections/VideosCollection');
const VideoModel = require('../../../datasource/models/VideoModel');

class VideoListComponent extends React.Component {
    constructor(props) {
        super(props);

        _.bindAll(this, '_onCollectionUpdate', '_onFetchNext', '_onTagSelect', '_onItem');

        const collection = this.props.collection.clone();

        this.state = { collection };

        collection.on('sync reset', this._onCollectionUpdate);
    }

    /**
     * Lifecycle methods
     */

    getChildContext() {
        return { collection: this.state.collection };
    }

    render() {
        const collection = this.state.collection;
        let counter = 0;

        return (
            <CollectionScrolling onUpdate={this._onFetchNext}>
                <CollectionLoader>
                    <div className="component-videolist items">
                        {collection.map(function (item, i) {
                            if (i % 30 === 0) counter = 0;

                            const videoId = item.get('videoId');
                            const image = item.get('thumbnails').high.url;
                            const description = item.get('description');
                            const title = item.get('title');
                            const publishedAt = moment(item.get('publishedAt'));

                            const videoModel = this.state['video.' + videoId];
                            const videoInfo = storage.getVideoInfo(videoId);
                            let duration = '00:00';
                            let tags = [];
                            let itemClassName = 'item is-transparent item-t-' + counter;

                            if (videoModel) {
                                duration = VideoModel.humanizeDuration(videoModel.get('duration'));
                                tags = videoModel.get('tags');
                            }

                            if (videoInfo.watched) {
                                itemClassName += ' is-watched';
                            }

                            counter++;

                            return (
                                <div className={itemClassName} key={item.id} ref={this._onItem}>
                                    <ThumbComponent image={image} title={title} description={description} link={'#/video/' + videoId}
                                                    labelLeft={<span className="duration label label-default">{duration}</span>}
                                                    labelRight={<span className="published-at label label-default">{publishedAt.fromNow()}</span>}>
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

        collection.off('sync reset', this._onCollectionUpdate);

        if (this._collectionXHR) {
            this._collectionXHR.abort();
        }

        if (this._videoCollectionXHR) {
            this._videoCollectionXHR.abort();
        }
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

        this._collectionXHR = collection.fetch();
        this._collectionXHR.then(() => this._fetchVideos());
    }

    _fetchVideos() {
        const collection = this.state.collection;
        const videoCollection = new VideoCollection();

        const fetchedItems = collection.getFetchedItems ? collection.getFetchedItems() : collection;
        const videoIds = fetchedItems.map(item => item.get('videoId'));

        if (videoIds.length === 0) return;

        videoCollection.setVideoIds(videoIds);

        this._videoCollectionXHR = videoCollection.fetch();
        this._videoCollectionXHR.then(() => {
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

        if (!collection.getPageToken || !collection.setPageToken) {
            return;
        }

        const token = collection.getPageToken();

        if (token) {
            collection.setPageToken(token);

            this._fetch();
        }
    }

    _onItem(el) {
        _.delay(() => $(el).removeClass('is-transparent'), 0);
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

VideoListComponent.childContextTypes = {
    collection: React.PropTypes.object
};

module.exports = VideoListComponent;
