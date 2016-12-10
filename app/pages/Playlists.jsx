import React from 'react';
import {connect} from 'react-redux';
import Search from '../components/search/Search';
import BtnToTop from '../components/commons/BtnToTop';
import ItemList from '../components/list/ItemList';
import PlaylistListItem from '../components/playlists/PlaylistListItem';
import {fetchPlaylists, fetchAutocomplete, filterPlaylists} from '../actions/playlists';

const mapStateToProps = state => {
    const { items, loading, fetched, q, channelId, autocomplete } = state.playlists;

    return {
        items,
        loading,
        fetched,
        q,
        channelId,
        autocomplete
    };
};

@connect(mapStateToProps)
class Playlists extends React.Component {

    componentWillMount() {
        this._fetch();
    }

    render() {
        const { q, channelId, fetched, loading, autocomplete } = this.props;
        const items = this._filterItems();

        return (
            <div className="module-playlists">
                <Search q={q} channelId={channelId} autocomplete={autocomplete} onSearch={this._onSearch.bind(this)}/>
                <ItemList uid="playlists.playlists" fetched={fetched} loading={loading}>
                    {items.map(item => <PlaylistListItem key={item.id} item={item}/>)}
                </ItemList>
                <BtnToTop/>
            </div>
        );
    }

    _fetch() {
        const dispatch = this.props.dispatch;

        dispatch(fetchAutocomplete());
        dispatch(fetchPlaylists());
    }

    _filterItems() {
        const { items, q, channelId } = this.props;

        return _.filter(items, item => {
            const itemChannelId = item.channelId;
            const title = item.title;

            if (itemChannelId !== channelId) return false;

            if (q === '') return true;

            return title.toLowerCase().indexOf(q.toLowerCase()) !== -1;
        });
    }

    _onSearch(channelId, q) {
        const dispatch = this.props.dispatch;

        dispatch(filterPlaylists(channelId, q));
    }
}

export default Playlists;
