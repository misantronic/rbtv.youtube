import React from 'react';
import _ from 'underscore';
import {Component} from 'react';
import Config from '../../../app/Config';

class SearchComponent extends Component {
    constructor(props) {
        super(props);

        _.bindAll(this, '_onChange', '_onChannelRBTV', '_onChannelLP');

        this.state = {
            value: props.value || '',
            channel: props.channel || Config.channelRBTV,
            placeholder: this._getPlaceholder()
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
            <div className="component-search search-container">
                <div className="search-label-container">
                    <label className="search-label">
                        <input className="form-control search" type="text" placeholder={this.state.placeholder} value={this.state.value || this.props.value} onChange={this._onChange}/>
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
        );
    }

    componentDidUpdate(prevProps, prevState) {
        if (this._stateHasChanged(prevState, 'channel')) {
            this._setPlaceholder();
        }
    }

    /**
     * Private methods
     */

    _setPlaceholder() {
        this.setState({ placeholder: this._getPlaceholder() });
    }

    _getPlaceholder() {
        const channel = this.state ? this.state.channel : Config.channelRBTV;

        switch (channel) {
            case Config.channelRBTV:
                return 'Rocketbeans TV durchsuchen...';
            case Config.channelLP:
                return 'Let\'s Plays durchsuchen...';
            default:
                return 'Suche...';
        }
    }

    _stateHasChanged(prevState, prop) {
        return prevState[prop] !== this.state[prop];
    }

    /**
     * Event handler
     */

    _onChange(e) {
        const value = e.target.value;

        this.setState({ value });

        if (this.props.onSearch) {
            this.props.onSearch(value);
        }
    }

    _onChannelRBTV() {
        const channel = Config.channelRBTV;

        this.setState({ channel });

        if (this.props.onChannel) {
            this.props.onChannel(channel);
        }
    }

    _onChannelLP() {
        const channel = Config.channelLP;

        this.setState({ channel: Config.channelLP });

        if (this.props.onChannel) {
            this.props.onChannel(channel);
        }
    }
}

export default SearchComponent;
