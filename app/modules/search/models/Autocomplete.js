import {Model, Collection} from 'backbone'

class AutocompleteItem extends Model {
    defaults() {
        return {
            title: null,
            channel: null,
            expr: new RegExp(),
            playlistId: null,

            _selected: false
        }
    }
}

class Autocomplete extends Collection {
    constructor(...args) {
        super(...args);

        this.model = AutocompleteItem;

        this._originalModels = this.models;

        this.search();
    }

    search(val, exclude = []) {
        if (val) {
            this.reset(
                _.filter(
                    _.difference(this._originalModels, exclude),
                    model => model.get('expr').test(val)
                )
            );
        }
    }
}

export {AutocompleteItem, Autocomplete}
export default Autocomplete