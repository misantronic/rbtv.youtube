import React from 'react';
import Select from 'react-select';
import _ from 'underscore';
import Config from '../../Config';
import Autocomplete from './Autocomplete';

class Search extends React.Component {
    constructor(props) {
        super(props);

        _.bindAll(this, '_onChange', '_onChannelSelect', '_onSubmit', '_onKeyDown', '_onSelectAutocomplete');

        this._searchTimeout = 0;

        this.state = {
            q: this.props.q
        };
    }

    render() {
        /** @type {Autocomplete} */
        this.autocomplete = null;

        const { channelId, autocomplete } = this.props;
        const { q } = this.state;
        const placeholder = this._getPlaceholder();

        return (
            <form className="component-search search-container" onSubmit={this._onSubmit}>
                <div className="search-label-container">
                    <label className="search-label">
                        <input type="text"
                               className="form-control search"
                               placeholder={placeholder}
                               value={q}
                               onChange={this._onChange} onKeyDown={this._onKeyDown}/>
                        <Autocomplete
                            items={autocomplete}
                            ref={el => this.autocomplete = el}
                            onSelect={this._onSelectAutocomplete}/>
                    </label>
                </div>
                <Select
                    clearable={false}
                    searchable={false}
                    value={channelId}
                    options={_.map(Config.channels, channelObj => ({ value: channelObj.id, label: channelObj.name }))}
                    onChange={this._onChannelSelect}
                />
            </form>
        );
    }

    /**
     * Private methods
     */

    _search(q, channelId = this.props.channelId, delay = 32) {
        clearTimeout(this._searchTimeout);

        this._searchTimeout = setTimeout(() => {
            this.props.onSearch(channelId, q);
        }, delay);
    }

    _getPlaceholder() {
        const id = this.props.channelId;
        const channel = _.findWhere(Config.channels, { id });

        if (channel) {
            return channel.name + ' durchsuchen...';
        }

        return 'Suche...';
    }

    /**
     * Event handler
     */

    _onChange(e) {
        const q = e.target.value;
        const { channelId } = this.props;

        this.setState({ q });

        if (!this.autocomplete.isLocked()) {
            // Update autocomplete
            this.autocomplete.update(q);
        }

        // Refetch when value is empty
        if (q === '') {
            this._search(q, channelId, 350);
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

    _onSelectAutocomplete(q, channelId) {
        this.setState({ q }, () => this._search(q, channelId, 0));
    }

    _onSubmit(e) {
        const q = this.state.q;

        this.autocomplete.hasValue()
            ? this.autocomplete.search(q)
            : this._search(q);

        e.preventDefault();
    }

    _onChannelSelect(option) {
        const { q } = this.props;
        const channelId = option.value;

        this._search(q, channelId, 0);
    }
}

Search.defaultProps = {
    onSearch: _.noop
};

Search.propTypes = {
    q: React.PropTypes.string,
    channelId: React.PropTypes.string,
    autocomplete: React.PropTypes.array,
    onSearch: React.PropTypes.func.isRequired
};

export default Search;
