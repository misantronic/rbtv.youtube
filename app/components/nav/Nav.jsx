import React from 'react';
const Link = require('react-router').Link;
const IndexLink = require('react-router').IndexLink;
import Config from '../../Config';
import watchlist from '../../utils/watchlist';
import storage from '../../utils/storage';

class NavModule extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            countWatchlist: watchlist.getList().length
        };

        watchlist.on('added removed', this._onWatchlistChanged.bind(this));
    }

    render() {
        return (
            <div className="module-nav">
                <ul className="nav nav-pills">
                    <li className="nav-item">
                        <IndexLink to="/" activeClassName="active" onClick={this._onClickLink}>Übersicht</IndexLink>
                    </li>
                    <li className="nav-item">
                        <Link to="/playlists" activeClassName="active" onClick={this._onClickLink}>Playlists</Link>
                    </li>
                    <li className="nav-item">
                        <Link to={'/live/' + Config.liveId} activeClassName="active" onClick={this._onClickLink}>Live</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/timetable" activeClassName="active" onClick={this._onClickLink}>Wochenplan</Link>
                    </li>
                    <li className="nav-item nav-item-watchlater">
                        <Link to="/watchlater" activeClassName="active" onClick={this._onClickLink}>
                            Watch later <span className="badge">{this.state.countWatchlist}</span>
                        </Link>
                    </li>
                </ul>
            </div>
        );
    }

    componentWillUnmount() {
        watchlist.off('added removed');
    }

    _onWatchlistChanged() {
        this.setState({ countWatchlist: watchlist.getList().length });
    }

    _onClickLink() {
        storage.remove('scrolling');
    }
}

module.exports = NavModule;

