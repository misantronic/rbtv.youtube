const React = require('react');
const _ = require('underscore');
const $ = require('jquery');
const Config = require('../../Config');
const AutocompleteComponent = require('./Autocomplete');

class SearchComponent extends React.Component {
    constructor(props) {
        super(props);

        _.bindAll(this, '_onChange', '_onChannelRBTV', '_onChannelLP', '_onSubmit', '_onKeyDown', '_onSelectAutocomplete');

        this._searchTimeout = 0;

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

        /** @type {AutocompleteComponent} */
        this.autocomplete = null;

        return (
            <form className="component-search search-container" onSubmit={this._onSubmit}>
                <div className="search-label-container">
                    <label className="search-label">
                        <input type="text"
                               className="form-control search"
                               placeholder={this.state.placeholder}
                               value={this.state.value}
                               onChange={this._onChange} onKeyDown={this._onKeyDown}/>
                        <AutocompleteComponent
                            items={this.props.autocomplete}
                            ref={el => this.autocomplete = el}
                            onSelect={this._onSelectAutocomplete}/>
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
            </form>
        );
    }

    componentDidUpdate(prevProps, prevState) {
        if (this._stateHasChanged(prevState, 'channel')) {
            this._setPlaceholder();
        }

        if (this._propHasChanged(prevProps, 'value')) {
            this.setState({ value: this.props.value });
        }
    }

    /**
     * Private methods
     */

    _search(value, channel = this.state.channel, delay = 32) {
        if (this.props.onSearch) {
            clearTimeout(this._searchTimeout);

            this._searchTimeout = setTimeout(function () {
                this.props.onSearch(value, channel);
            }.bind(this), delay);
        }
    }

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

    _propHasChanged(prevProps, prop) {
        return prevProps[prop] !== this.props[prop];
    }

    /**
     * Event handler
     */

    _onChange(e) {
        const value = e.target.value;

        // Update state
        this.setState({ value });

        // Update autocomplete
        this.autocomplete.update(value);

        // Refetch when value is empty
        if (value === '') {
            this._search(value, this.state.channel, 350);
        }
    }

    _onKeyDown(e) {
        const value = e.target.value;

        if (e.keyCode === 9) {
            e.preventDefault();

            this.autocomplete.search(value);
        }
    }

    _onSelectAutocomplete(value, channel) {
        const stateObj = { value };

        if (channel) {
            stateObj.channel = channel;
        }

        this.setState(stateObj);

        this._search(value, channel, 0);
    }

    _onSubmit(e) {
        this._search(this.state.value);

        e.preventDefault();
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

        this.setState({ channel });

        if (this.props.onChannel) {
            this.props.onChannel(channel);
        }
    }
}

module.exports = SearchComponent;
