import _ from 'underscore';
import {View} from 'backbone';

let addBindingFn = View.prototype.addBinding;

_.extend(View.prototype, {
    addBinding: function (optionalModel, selector, binding) {
        // Consider Marionette uiBindings
        if (_.isString(selector) && selector.charAt(0) === '@' && this.ui) {
            selector = this.ui[selector.substr(4)].selector;
        }

        return addBindingFn.call(this, optionalModel, selector, binding);
    }
});