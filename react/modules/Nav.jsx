import React from 'react';
import {Component} from 'react';
import {Link, IndexLink} from 'react-router';

class Nav extends Component {
    render() {
        return (
            <ul className="navigation nav nav-pills" style={{ marginBottom: 30 }}>
                <li><IndexLink to="/" activeClassName="active">Übersicht</IndexLink></li>
                <li><Link to="/playlists" activeClassName="active">Playlists</Link></li>
                <li><Link to="/shows" activeClassName="active">Shows</Link></li>
            </ul>
        );
    }
}

export default Nav;
