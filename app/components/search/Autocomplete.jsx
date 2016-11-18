const React = require('react');
const $ = require('jquery');

class AutocompleteComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            search: '',     // search base-value from outside
            channel: null,  // the channel being recommended
            value: '',      // the value completing the search-value
            index: 0,       // the current index in items
            items: [],      // filtered results of the search
            locked: false
        };
    }

    render() {
        this.canvas = null;
        this.$autocomplete = null;

        return (
            <div className="component-autocomplete"
                 ref={el => this.$autocomplete = $(el)}>
                <span className={this.state.items.length > 1 ? 'is-cycling' : ''}>{this.state.value}</span>
                <canvas ref={el => this.canvas = el} width="700" height="30"></canvas>
            </div>
        );
    }

    /** @returns {boolean} */
    hasValue() {
        return !!this.state.value;
    }

    isLocked() {
        return this.state.locked;
    }

    reset() {
        this.setState({
            index: 0,
            value: '',
            search: '',
            channel: null,
            isCycling: false,
            items: []
        });
    }

    lock() {
        this.setState({ locked: true });
    }

    unlock() {
        this.setState({ locked: false });
    }

    search(value) {
        if (!this.state.value) return false;

        const search = value + this.state.value;
        const channel = this.state.channel;

        if (value) {
            this.props.onSelect(search, channel);

            this.reset();
        }

        return true;
    }

    update(search = this.state.search) {
        let autocompleteItem = null;
        let items = [];
        let stateObj = false;

        if (search !== '') {
            items = this.props.items.filter(item => new RegExp('^' + search, 'i').test(item.get('title')));

            autocompleteItem = items[this.state.index];
        }

        const value = autocompleteItem ? autocompleteItem.get('title').replace(new RegExp(search, 'i'), '') : '';
        const channel = autocompleteItem ? autocompleteItem.get('channel') || autocompleteItem.get('channelId') : null;

        if (this.$autocomplete) {
            this.$autocomplete.hide();

            if (this.canvas && search.length >= 2) {
                stateObj = {
                    search,
                    value,
                    channel,
                    items,
                    index: this.state.index
                };

                const ctx = this.canvas.getContext('2d');

                ctx.clearRect(0, 0, 700, 30);
                ctx.font = '14px Raleway';
                ctx.fillText(search, 1, 1);

                const searchWidth = ctx.measureText(search).width;

                this.$autocomplete
                    .css('left', 46 + searchWidth)
                    .show();
            }
        }

        stateObj
            ? this.setState(stateObj)
            : this.reset();
    }

    next() {
        const items = this.state.items;
        let index = this.state.index + 1;

        if (!items[index]) index = 0;

        this.setState({ index }, () => this.update());
    }

    prev() {
        const items = this.state.items;
        let index = this.state.index - 1;

        if (!items[index]) index = items.length - 1;

        this.setState({ index }, () => this.update());
    }
}

module.exports = AutocompleteComponent;
