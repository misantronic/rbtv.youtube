const React = require('react');
const $ = require('jquery');
const TimetableEvent = require('./TimetableEvent');

class TimetableDayComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        const collection = this.props.collection;
        const playlists = this.props.playlists;

        return (
            <div className="component-timetable-day" ref={this._onEl.bind(this)}>
                {collection.map(item => <TimetableEvent key={item.id} item={item} playlists={playlists} />)}
            </div>
        );
    }

    _onEl(el) {
        const $el = $(el);


    }
}

TimetableDayComponent.propTypes = {
    collection: React.PropTypes.object,
    playlists: React.PropTypes.object
};

module.exports = TimetableDayComponent;
