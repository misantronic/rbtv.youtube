import _ from 'underscore';
import {Behavior, Region} from 'backbone.marionette';
import SearchFormView from '../../modules/search/views/SearchForm';

const Search = Behavior.extend({
    onRender() {
        const container = this.options.container;
        const $container = this.view.$(container);

        // Handle errors
        if (!container) {
            return console.warn('Cannot render SearchBehavior to view. Please set a selector-value for container');
        } else if ($container.length === 0) {
            return console.warn('Cannot render SearchBehavior to view. Container \'' + container + '\' is missing in .', this.view);
        }

        // Remove container from options
        this.options = _.omit(this.options, 'container');

        // Set-up options for view
        const options = _.defaults(this.options, {
            filterCheckboxBehavior: false,
            tags: true,
            model: this.view.model
        });

        // Render view
        const view = new SearchFormView(options);

        this.listenTo(view, 'search', this._onSearch);

        // Attach
        this._region = new Region({ el: $container });
        this._region.show(view);
    },

    onDestroy() {
        this._region.empty();
    },

    _onSearch() {
        this.view.trigger('search');
    }
});

export default Search;
