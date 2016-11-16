const React = require('react');
const _ = require('underscore');
const $ = require('jquery');
const Config = require('../../Config');

class SearchComponent extends React.Component {
    constructor(props) {
        super(props);

        _.bindAll(this, '_onChange', '_onChannelRBTV', '_onChannelLP', '_onSubmit', '_onKeyDown');

        this._searchTimeout = 0;

        this.state = {
            value: props.value || '',
            channel: props.channel || Config.channelRBTV,
            placeholder: this._getPlaceholder(),
            autocompleteChannel: null,
            autocompleteStr: ''
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

        this.canvas = null;
        this.$autocomplete = null;

        return (
            <form className="component-search search-container" onSubmit={this._onSubmit}>
                <div className="search-label-container">
                    <label className="search-label">
                        <input type="text"
                               className="form-control search"
                               placeholder={this.state.placeholder}
                               value={this.state.value}
                               onChange={this._onChange} onKeyDown={this._onKeyDown}/>
                        <div className="component-autocomplete"
                             ref={el => this.$autocomplete = $(el)}>
                            {this.state.autocompleteStr}
                        </div>
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
                <canvas ref={el => this.canvas = el} width="700" height="30"></canvas>
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

    _search(value, delay = 32) {
        if (this.props.onSearch) {
            clearTimeout(this._searchTimeout);

            this._searchTimeout = setTimeout(function () {
                this.props.onSearch(value, this.state.channel);
            }.bind(this), delay);
        }
    }

    _searchAutocomplete() {
        const autocompleteStr = this.state.autocompleteStr;
        const autocompleteChannel = this.state.autocompleteChannel;

        if (autocompleteStr) {
            const newValue = this.state.value + this.state.autocompleteStr;

            this.setState({
                autocompleteStr: '',
                channel: autocompleteChannel || this.state.channel,
                value: newValue
            }, () => this._search(newValue));
        }

        return !!autocompleteStr;
    }

    _setAutocomplete(value) {
        const autocomplete = this.props.autocomplete.filter(item => new RegExp(value, 'i').test(item.get('title')));
        const autocompleteItem = _.first(autocomplete);
        const autocompleteStr = autocompleteItem ? autocompleteItem.get('title').replace(new RegExp(value, 'i'), '') : '';
        const autocompleteChannel = autocompleteItem ? autocompleteItem.get('channel') : null;

        this.setState({
            value,
            autocompleteStr,
            autocompleteChannel
        });

        if (this.$autocomplete) {
            this.$autocomplete.hide();

            if (this.canvas && value.length > 2) {
                const ctx = this.canvas.getContext('2d');

                ctx.clearRect(0, 0, 700, 30);
                ctx.font = '14px Raleway';
                ctx.fillText(value, 1, 1);

                const searchWidth = ctx.measureText(value).width;

                this.$autocomplete
                    .css('left', 46 + searchWidth)
                    .show();
            }
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

        this._setAutocomplete(value);

        if (value === '') {
            this._search(value, 350);
        }
    }

    _onKeyDown(e) {
        if (e.keyCode === 9 && this.state.autocompleteStr) {
            e.preventDefault();

            this._searchAutocomplete();
        }
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
