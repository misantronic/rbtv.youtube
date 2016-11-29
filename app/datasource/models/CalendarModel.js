const Model = require('backbone').Model;

/**
 * @class CalendarModel
 */
module.exports = Model.extend({

    defaults: {},

    getTitle() {
        return this.get('summary').replace(/^\[\w]\s/i, '').split(' - ')[0];
    },

    getDescription() {
        const title = this.getTitle();
        const desc = this.get('summary').replace(/^\[\w]\s/i, '').split(' - ')[1];

        return title === desc ? '' : desc;
    },

    getType() {
        const summary = this.get('summary');

        if (summary.indexOf('[L]') === 0) {
            return 'live';
        }

        if (summary.indexOf('[N]') === 0) {
            return 'premiere';
        }

        return '';
    }
});
