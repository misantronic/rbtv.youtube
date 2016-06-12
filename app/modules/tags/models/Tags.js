import _ from 'underscore';
import {Collection} from 'backbone';
import Tag from './Tag';

const Tags = Collection.extend({
    constructor(...args) {
        Collection.apply(this, args);

        this._originalModels = this.models.slice(0);
    },

    model: Tag,

    search(val, exclude = []) {
        if (!val) return;

        this.reset(
            _.filter(
                _.difference(this._originalModels, exclude),
                model => model.get('expr').test(val)
            )
        );
    }
});

export default Tags;
