import React from 'react';
import CalendarCollection from '../../datasource/collections/CalendarCollection';
import PlaylistsCollection from '../../datasource/collections/PlaylistsCollection';
import TimetableDay from './TimetableDay';
import Config from '../../Config';

class TimetableComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            collection: new CalendarCollection(),
            playlistsCollection: new PlaylistsCollection()
        };
    }

    render() {
        const collection = this.state.collection;
        const playlistsCollection = this.state.playlistsCollection;
        let days = [];

        if (this.props.filter === 1) {
            days = [
                collection.filterByDay(1),
                collection.filterByDay(2),
                collection.filterByDay(3),
                collection.filterByDay(4),
                collection.filterByDay(5)
            ];
        }

        if (this.props.filter === 2) {
            days = [
                collection.filterByDay(6),
                collection.filterByDay(0)
            ];
        }

        return (
            <div className="component-timetable">
                <div className="week-header">
                    {days.map(day => {
                        const event = day.first();

                        if (!event) {
                            return '';
                        }

                        const start = event.get('start');
                        const weekDay = `${start.format('dddd')}, ${start.format('DD.MM')}`;

                        return <div key={event.id} className="week-header-day">{weekDay}</div>;
                    })}
                </div>
                <div className="week-content">
                    <div className="week-hours">
                        {Config.timetableHours.map(hour => <div key={hour} className="week-hour">{hour}</div>)}
                    </div>
                    <div className="week">
                        {Config.timetableHours.map(hour => (
                            <div key={hour} className="hour-line">
                                <div className="half-hour" style={{ top: (hour - 10) * 100 - 50 + 'px' }}></div>
                                <div className="hour" style={{ top: (hour - 10) * 100 + 'px' }}></div>
                            </div>
                        ))}

                        {days.map((day, i) => <TimetableDay key={i} collection={day} playlists={playlistsCollection} />)}
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount() {
        this._fetch();
    }

    componentWillUnmount() {
        if (this._xhr) {
            this._xhr.abort();
        }
    }

    /**
     * Private methods
     */

    _fetch() {
        const collection = this.state.collection;
        const playlistsCollection = this.state.playlistsCollection;

        this._xhr = collection.fetch();
        this._xhr.done(() => this.forceUpdate());

        this._playlistsXhr = playlistsCollection.fetch();
        this._playlistsXhr.done(() => this.forceUpdate());
    }
}

TimetableComponent.defaultProps = {
    filter: 1
};

module.exports = TimetableComponent;
