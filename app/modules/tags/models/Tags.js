import _ from 'underscore';
import {Model, Collection} from 'backbone';
import {props} from '../../decorators';

class Tag extends Model {
    @props({
        idAttribute: 'title'
    })

    defaults() {
        return {
            title: null,
            channel: null,
            expr: new RegExp(),
            playlistId: null,

            _selected: false
        };
    }

    initialize() {
        const expr = this.get('expr');

        // Parse expression
        if (_.isString(expr)) {
            this.set('expr', new RegExp(expr));
        }
    }
}

class Tags extends Collection {
    constructor(...args) {
        super(...args);

        this._originalModels = this.models.slice(0);
    }

    @props({
        model: Tag
    })

    search(val, exclude = []) {
        if (!val) return;

        this.reset(
            _.filter(
                _.difference(this._originalModels, exclude),
                model => model.get('expr').test(val)
            )
        );
    }
}

export {Tag, Tags};
export default Tags;
