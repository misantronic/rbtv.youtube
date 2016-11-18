const React = require('react');
const _ = require('underscore');
const watchlist = require('../../utils/watchlist');

/**
 * @class BtnWatchLater
 */
class BtnWatchLater extends React.Component {
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
            <button className={'btn-watch-later' + (this.state.active ? ' is-active' : '') + (this.props.size ? ' is-' + this.props.size : '')} title="Watch later" onClick={this._onWatchLater}>
                <span className="glyphicon glyphicon-time"></span>
            </button>
        );
    }

    _onWatchLater() {
        const id = this.props.id;
        const type = this.props.type;
        const onAdd = this.props.onAdd || _.noop;
        const onRemove = this.props.onRemove || _.noop;

        const active = !this.state.active;

        if (active) {
            watchlist.add(id, type);
            onAdd(id, type);
        } else {
            watchlist.remove(id);
            onRemove(id);
        }

        this.setState({ active });
    }
}

module.exports = BtnWatchLater;
