import _ from 'underscore';
import moment from 'moment';
const Collection = require('backbone').Collection;
import youtubeController from '../../utils/youtubeController';
import Config from '../../Config';
import CalendarModel from './../models/CalendarModel';

module.exports = Collection.extend({

    model: CalendarModel,

    comparator: 'start',

    url() {
        return `${youtubeController.endpoints.calendar}/5aj6musne0k96vbqlu43p8lgs0@group.calendar.google.com/events?singleEvents=true&key=${Config.key}`;
    },

    parse(response) {
        return _.map(response.items, item => {
            item.start = moment(item.start.dateTime);
            item.end = moment(item.end.dateTime);
            item.updated = moment(item.update);
            item.created = moment(item.created);

            return item;
        });
    },

    filterByDay(day) {
        return new Collection(
            this.filter(item => item.get('start').day() === day)
        );
    }
});
