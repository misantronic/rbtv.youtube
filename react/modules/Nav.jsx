const React = require('react');
const Link = require('react-router').Link;
const IndexLink = require('react-router').IndexLink;
const Config = require('../Config');
const watchlist = require('../utils/watchlist');

class NavModule extends React.Component {
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
                    <li className="nav-item"><Link to={'/live/'+ Config.liveId} activeClassName="active">Live</Link></li>
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

module.exports = NavModule;

