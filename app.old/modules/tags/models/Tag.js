import _ from 'underscore';
import {Model} from 'backbone';

const Tag = Model.extend({
    idAttribute: 'title',

    defaults() {
        return {
            title: null,
            channel: null,
            expr: new RegExp(),
            playlistId: null,

            _selected: false
        };
    },

    initialize() {
        const expr = this.get('expr');

        // Parse expression
        if (_.isString(expr)) {
            this.set('expr', new RegExp(expr));
        }
    }
});

export default Tag;
