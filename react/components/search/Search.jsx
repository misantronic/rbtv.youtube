import React from 'react';
import _ from 'underscore';
import {Component} from 'react';
import Config from '../../../app/Config';

class Search extends Component {
    constructor(props) {
        super(props);

        _.bindAll(this, '_onChange', '_onChannelRBTV', '_onChannelLP');

        this.state = {
            value: '',
            channel: Config.channelRBTV
        };
    }

    render() {
        let classNameRBTV = 'btn btn-default';
        let classNameLP = 'btn btn-default';

        if (this.state.channel === Config.channelRBTV) {
            classNameRBTV += ' active';
        }

        if (this.state.channel === Config.channelLP) {
            classNameLP += ' active';
        }

        return (
            <div className="component-search">
                <div className="search-container">
                    <div className="search-label-container">
                        <label className="search-label">
                            <input className="form-control search" type="text" value={this.state.value || this.props.value} onChange={this._onChange}/>
                        </label>
                    </div>
                    <div className="btn-group filter-buttons" role="group">
                        <button type="button" className={classNameRBTV} onClick={this._onChannelRBTV}>
                            <span className="hidden-xs">Rocket Beans TV</span>
                            <span className="visible-xs-inline">RBTV</span>
                        </button>
                        <button type="button" className={classNameLP} onClick={this._onChannelLP}>
                            <span className="hidden-xs">Let`s Play</span>
                            <span className="visible-xs-inline">LP</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    _onChange(e) {
        const value = e.target.value;

        this.setState({ value });

        if (this.props.onSearch) {
            this.props.onSearch(value);
        }
    }

    _onChannelRBTV(e) {
        const channel = Config.channelRBTV;

        this.setState({ channel });

        if (this.props.onChannel) {
            this.props.onChannel(channel);
        }
    }

    _onChannelLP(e) {
        const channel = Config.channelLP;

        this.setState({ channel: Config.channelLP });

        if (this.props.onChannel) {
            this.props.onChannel(channel);
        }
    }
}

export default Search;
