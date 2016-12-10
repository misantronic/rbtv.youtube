import React from 'react';
import $ from 'jquery';
import {Link} from 'react-router';

class TimetableEventComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        /** @type {CalendarModel} */
        const item = this.props.item;

        const title = item.getTitle();
        const type = item.getType();
        const desc = item.getDescription();
        const start = item.get('start');
        // const end = item.get('end');
        const className = 'component-timetable-event is-' + type;

        const playlist = this.props.playlists.find(playlist => title.indexOf(playlist.get('title')) === 0);
        const link = playlist ? <Link to={'playlists/' + playlist.id}>{title}</Link> : title;

        return (
            <div className={className} ref={this._onEl.bind(this)}>
                <label className="date label label-default">
                    <time>{start.format('HH:mm')}</time>
                    {/*<br/> - <br/>*/}
                    {/*<time>{end.format('HH:mm')}</time>*/}
                </label>
                <div className="content">
                    <h3 className="title">{link}</h3>
                    <p className="description">{desc}</p>
                </div>
            </div>
        );
    }

    _onEl(el) {
        const $el = $(el);
        /** @type {CalendarModel} */
        const item = this.props.item;
        const start = item.get('start');
        const end = item.get('end');

        // Calculate exact duration
        let duration = Math.abs(end.diff(start)) / 1000 / 60;

        // Correct duration to 5 mins
        duration -= duration % 5;

        // Calculate height
        const height = duration / 60 * 100 - 1;

        // Calculate y-position
        let top = (start.hour() - 10) * 100; // hour

        top += Math.round(start.minute() / 60 * 100); // minute

        $el.css({ top, height });

        if (duration <= 15) {
            $el.addClass('is-short');
        }
    }
}

module.exports = TimetableEventComponent;
