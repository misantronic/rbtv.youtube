import {Model, Collection} from 'backbone'

class AutocompleteItem extends Model {
    defaults() {
        return {
            title: null,
            search: new RegExp(),
            playlistId: null
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

    search(val) {
        if (val) {
            this.reset(
                _.filter(this._originalModels, model => model.get('expr').test(val))
            );
        } else {
            this.reset();
        }
    }
}

export {AutocompleteItem, Autocomplete}
export default Autocomplete