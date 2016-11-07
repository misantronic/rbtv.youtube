import React from 'react';
import _ from 'underscore';
import Config from '../../../app/Config';
import CollectionLoader from '../../behaviors/CollectionLoader';
import CollectionScrolling from '../../behaviors/CollectionScrolling';
import ThumbComponent from '../commons/Thumb';
import ButtonWatchLater from '../commons/ButtonWatchLater';

class PlaylistsComponent extends React.Component {
    constructor(props) {
        super(props);

        _.bindAll(this, '_onFetchNext');

        const collection = this.props.collection.clone();

        this.state = { collection };
    }

    /**
     * Lifecycle methods
     */

    render() {
        const collection = this.state.collection;

        return (
            <CollectionScrolling collection={collection} onUpdate={this._onFetchNext}>
                <CollectionLoader collection={collection}>
                    <div className="component-playlists items">
                        {collection.map(function (item) {
                            const id = item.id;
                            const title = item.get('title');
                            const desc = item.get('description');
                            const image = item.get('thumbnails').high.url;
                            const itemCount = item.get('itemCount');

                            return (
                                <div key={id} className="item">
                                    <ThumbComponent
                                        link={'#/playlists/' + id}
                                        title={title}
                                        description={desc}
                                        image={image}
                                        badge={<span className="badge">{itemCount}</span>}>
                                        <ButtonWatchLater id={id} type="playlist"/>
                                    </ThumbComponent>
                                </div>
                            );
                        })}
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
            this._search();
        }
    }

    /**
     * Private methods
     */

    _shouldInvalidate(props) {
        return props.search !== this.props.search ||
            props.channel !== this.props.channel;
    }

    _fetch() {
        const collection = this.state.collection;

        collection
            .fetch()
            .then(() => this._search());
    }

    _search(add = false) {
        const collection = this.state.collection;

        collection.filterBy({
            search: this.props.search,
            channelRBTV: this.props.channel === Config.channelRBTV,
            channelLP: this.props.channel === Config.channelLP,
            limit: 21,
            add
        });

        this.forceUpdate();
    }

    _onFetchNext() {
        this._search(true);
    }
}

export default PlaylistsComponent;
