import React from 'react';
import {connect} from 'react-redux';
import {fetchActivities, filterActivities, resetActivities, fetchAutocomplete} from '../actions/activities';

import ItemList from '../components/list/ItemList';
import VideoListItem from '../components/video/list/VideoListItem';
import Search from '../components/search/Search';
import BtnToTop from '../components/commons/BtnToTop';

const mapStateToProps = state => {
    const { items, nextPageToken, loading, fetched, q, channelId, autocomplete } = state.activities;

    return {
        items,
        nextPageToken,
        loading,
        fetched,
        q,
        channelId,
        autocomplete
    };
};

@connect(mapStateToProps)
class ActivitiesModule extends React.Component {

    componentWillMount() {
        if (this.props.items.length === 0) {
            this._onFetch(false);
        }

        const dispatch = this.props.dispatch;

        dispatch(fetchAutocomplete());
    }

    render() {
        const { items, q, channelId, fetched, loading, autocomplete } = this.props;

        return (
            <div className="module-activities">
                <Search q={q} channelId={channelId} autocomplete={autocomplete} onSearch={this._onSearch.bind(this)} />
                <ItemList uid="activities.videolist" onFetch={this._onFetch.bind(this)} loading={loading} fetched={fetched}>
                    {items.map(item => <VideoListItem key={item.videoId} item={item} />)}
                </ItemList>
                <BtnToTop/>
            </div>
        );
    }

    componentDidUpdate(prevProps) {
        if (prevProps.channelId !== this.props.channelId || prevProps.q !== this.props.q) {
            this._onFetch(true);
        }
    }

    _onFetch(reset = false) {
        const { dispatch, channelId, q } = this.props;
        const nextPageToken = reset ? '' : this.props.nextPageToken;

        if (reset === true) {
            dispatch(resetActivities());
        }

        // should fetch next but there is no token
        if (reset === false && nextPageToken === undefined) {
            return;
        }

        dispatch(fetchActivities(channelId, q, nextPageToken));
    }

    _onSearch(channelId, q) {
        const dispatch = this.props.dispatch;

        dispatch(filterActivities(channelId, q));
    }
}

export default ActivitiesModule;
