import React from 'react';
import CollectionLoader from '../../behaviors/CollectionLoader';
import CollectionScrolling from '../../behaviors/CollectionScrolling';
import ButtonWatchLater from './../commons/ButtonWatchLater';

export default function PlaylistItemsComponent(props) {
    const collection = props.collection;
    const onItemSelected = props.onItemSelected || function () {
        };

    return (
        <div className="component-playlist-items">
            <CollectionScrolling collection={collection} limit="30" container=".component-playlist-items">
                <CollectionLoader collection={collection}>
                    {collection.map(function (item) {
                        const videoId = item.get('videoId');
                        const title = item.get('title');
                        const image = item.get('thumbnails').medium.url;

                        return (
                            <div key={item.id} className="playlist-item">
                                <div className="image" style={{ backgroundImage: 'url(' + image + ')' }}>
                                    <ButtonWatchLater id={videoId} size="small"/>
                                </div>
                                <div className="title" onClick={() => onItemSelected(item)}>{title}</div>
                            </div>
                        );
                    })}
                </CollectionLoader>
            </CollectionScrolling>
        </div>
    );
}
