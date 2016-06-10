import _ from 'underscore'
import {Model} from 'backbone'
import AutocompleteCollection from '../../search/models/Autocomplete'
import {localStorage} from '../../../utils'

/**
 * @class SearchFormModel
 */
class SearchForm extends Model {
    defaults() {
        return {
            filterByRBTV: true,
            filterByLP: false,
            loading: false,
            showBtnToTop: false,
            search: '',
            tags: new AutocompleteCollection(),
            cacheKey: ''
        }
    }

    initialize() {
        const modelAttrs = this.getCache();

        this.set(modelAttrs);
    }

    setCache() {
        const cacheKey = this.get('cacheKey');

        if (!cacheKey) return;

        let data = _.omit(this.toJSON(), 'loading', 'showBtnToTop', 'cacheKey');

        // Map tags
        data.tags = _.map(data.tags.toJSON(), tag => {
            if (tag.expr) {
                tag.expr = tag.expr.toString();
            }

            return tag;
        });

        localStorage.update(cacheKey, data);
    }

    /**
     *
     * @returns {{filterByLP: Boolean, filterByRBTV: Boolean, search: String, tags: Autocomplete}}
     */
    getCache() {
        let attrs = {};

        const cacheKey = this.get('cacheKey');

        if (cacheKey) {
            attrs = localStorage.get(cacheKey) || {};

            if (attrs.tags) {
                attrs.tags = new AutocompleteCollection(attrs.tags)
            }
        }

        return attrs;
    }
}

export default SearchForm