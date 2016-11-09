import React from 'react';
import {Component} from 'react';
import {Link, IndexLink} from 'react-router';
import watchlist from '../utils/watchlist';

class NavModule extends Component {
    constructor(props) {
        super(props);

        this.state = {
            countWatchlist: watchlist.getList().length
        };

        watchlist.listenTo(watchlist, 'added removed', this._onWatchlistChanged.bind(this));
    }

    render() {
        return (
            <div className="module-nav">
                <ul className="nav nav-pills">
                    <li className="nav-item"><IndexLink to="/" activeClassName="active">Übersicht</IndexLink></li>
                    <li className="nav-item"><Link to="/playlists" activeClassName="active">Playlists</Link></li>
                    <li className="nav-item"><Link to="/live/rzCDzR8eR7o" activeClassName="active">Live</Link></li>
                    {/*<li><Link to="/shows" activeClassName="active">Shows</Link></li>*/}
                    <li className="nav-item nav-item-watchlater">
                        <Link to="/watchlater" activeClassName="active">
                            Watch later <span className="badge">{this.state.countWatchlist}</span>
                        </Link>
                    </li>
                </ul>
            </div>
        );
    }

    componentWillUnmount() {
        watchlist.stopListening(watchlist, 'added removed');
    }

    _onWatchlistChanged() {
        this.setState({ countWatchlist: watchlist.getList().length });
    }
}

export default NavModule;

