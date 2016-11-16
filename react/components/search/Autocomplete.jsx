const React = require('react');
const _ = require('underscore');
const $ = require('jquery');

class AutocompleteComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            channel: null,
            value: ''
        };
    }

    render() {
        this.canvas = null;
        this.$autocomplete = null;

        return (
            <div className="component-autocomplete"
                 ref={el => this.$autocomplete = $(el)}>
                <span>{this.state.value}</span>
                <canvas ref={el => this.canvas = el} width="700" height="30"></canvas>
            </div>
        );
    }

    search(value) {
        const search = value + this.state.value;
        const channel = this.state.channel;

        if (value) {
            this.props.onSelect(search, channel);

            this.setState({ value: '' });
        }
    }

    update(search) {
        let autocompleteItem = null;

        if (search !== '') {
            const autocomplete = this.props.items.filter(item => new RegExp(search, 'i').test(item.get('title')));

            autocompleteItem = _.first(autocomplete);
        }

        const value = autocompleteItem ? autocompleteItem.get('title').replace(new RegExp(search, 'i'), '') : '';
        const channel = autocompleteItem ? autocompleteItem.get('channel') : null;

        this.setState({ value, channel });

        if (this.$autocomplete) {
            this.$autocomplete.hide();

            if (this.canvas && search.length > 2) {
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
    }

}

module.exports = AutocompleteComponent;
