const React = require('react');
const _ = require('underscore');
const $ = require('jquery');
const Config = require('../../Config');
const AutocompleteComponent = require('./Autocomplete');

class SearchComponent extends React.Component {
    constructor(props) {
        super(props);

        _.bindAll(this, '_onChange', '_onChannelRBTV', '_onChannelLP', '_onChannelG2', '_onSubmit', '_onKeyDown', '_onSelectAutocomplete');

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
        let classNameG2 = 'btn btn-default';

        if (this.state.channel === Config.channelRBTV) {
            classNameRBTV += ' active';
        }

        if (this.state.channel === Config.channelLP) {
            classNameLP += ' active';
        }

        if (this.state.channel === Config.channelG2) {
            classNameG2 += ' active';
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
                    <button type="button" className={classNameG2} onClick={this._onChannelG2}>
                        <span className="hidden-xs">Game Two</span>
                        <span className="visible-xs-inline">G2</span>
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
            case Config.channelG2:
                return 'Game Two durchsuchen...';
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

        if (!this.autocomplete.isLocked()) {
            // Update autocomplete
            this.autocomplete.update(value);
        }

        // Refetch when value is empty
        if (value === '') {
            this._search(value, this.state.channel, 350);
        }
    }

    _onKeyDown(e) {
        const value = e.target.value;
        const keyCode = e.keyCode;

        if (keyCode === 9) { // tab
            if (this.autocomplete.search(value)) {
                e.preventDefault();
            }
        }

        if (keyCode === 38) { // key up
            e.preventDefault();

            this.autocomplete.prev();
        }

        if (keyCode === 40) { // key down
            e.preventDefault();

            this.autocomplete.next();
        }

        if (keyCode === 8) { // backspace
            this.autocomplete.reset();
            this.autocomplete.lock();

            if (this.autocomplete.hasValue()) {
                e.preventDefault();
            }
        } else {
            this.autocomplete.unlock();
        }
    }

    _onSelectAutocomplete(value, channel) {
        const stateObj = { value };

        if (channel) {
            stateObj.channel = channel;
        }

        this.setState(stateObj, () => this._search(value, channel, 0));
    }

    _onSubmit(e) {
        const value = this.state.value;

        this.autocomplete.hasValue()
            ? this.autocomplete.search(value)
            : this._search(value);

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

    _onChannelG2() {
        const channel = Config.channelG2;

        this.setState({ channel });

        if (this.props.onChannel) {
            this.props.onChannel(channel);
        }
    }
}

module.exports = SearchComponent;
