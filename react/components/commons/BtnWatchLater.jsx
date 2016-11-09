import React from 'react';
import {Component} from 'react';
import _ from 'underscore';
import watchlist from '../../utils/watchlist';

class BtnWatchLater extends Component {
    constructor(props) {
        super(props);

        _.bindAll(this, '_onWatchLater');

        const id = this.props.id;

        this.state = {
            active: watchlist.has(id)
        };
    }

    render() {
        return (
            <button className={'btn-watch-later' + (this.state.active ? ' is-active' : '') + (this.props.size ? ' is-'+ this.props.size : '')} title="Watch later" onClick={this._onWatchLater}>
                <span className="glyphicon glyphicon-time"></span>
            </button>
        );
    }

    _onWatchLater() {
        const id = this.props.id;
        const type = this.props.type;

        const active = !this.state.active;

        if (active) {
            watchlist.add(id, type);
        } else {
            watchlist.remove(id);
        }

        this.setState({ active });
    }
}

export default BtnWatchLater;
