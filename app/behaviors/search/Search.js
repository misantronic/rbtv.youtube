import _ from 'underscore'
import {Behavior} from 'backbone.marionette'
import SearchView from '../../modules/search/views/Search'

class Search extends Behavior {
    onRender() {
        const container  = this.options.container;
        const $container = this.view.$(container);

        // Handle errors
        if (!container) {
            return console.warn('Cannot render SearchBehavior to view. Please set a selector-value for container');
        } else if ($container.length === 0) {
            return console.warn('Cannot render SearchBehavior to view. Container \'' + container + '\' is missing in .', this.view);
        }

        // Remove container from options
        _.omit(this.options, 'container');

        // Set-up options for view
        var options = _.defaults(this.options, {
            filterCheckboxBehavior: false,
            model: this.view.model
        });

        // Render view
        const view = new SearchView(options).render();

        // Attach
        $container.html(view.$el);
    }
}

export default Search