import _ from 'underscore'
import {Model} from 'backbone'
import AutocompleteCollection from '../../search/models/Autocomplete'

class SearchForm extends Model {
    defaults() {
        return {
            filterByRBTV: true,
            filterByLP: false,
            loading: false,
            showBtnToTop: false,
            search: '',
            tags: new AutocompleteCollection()
        }
    }
    
    cache() {
        let data = _.omit(this.toJSON(), 'loading', 'showBtnToTop');

        data.tags = data.tags.toJSON();

        console.log(data);
    }
}

export default SearchForm