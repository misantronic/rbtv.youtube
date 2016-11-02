const React = require('react');
const Component = React.Component;

import { Link } from 'react-router';

class Nav extends Component {
    render() {
        return (
            <ul>
                <li><Link to="/activities">Übersicht</Link></li>
            </ul>
        );
    }
}

module.exports = Nav;
