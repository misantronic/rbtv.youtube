import {Behavior} from 'backbone.marionette';
import $ from 'jquery';

const Loader = Behavior.extend({
    modelEvents: {
        'change:loading': '_onLoading'
    },

    onShow() {
        const loaderHTML = require('./loader.ejs')();

        this.$loader = $(loaderHTML);

        // Check option: container
        const container = this.getOption('container');
        const $container = container ? this.view.$(container) : this.view.$el;

        $container.append(this.$loader);
    },

    onDestroy() {
        this.$loader.remove();
    },

    onShowLoader() {
        this.view.$el.addClass('is-loading');
        this.$loader.addClass('show');
    },

    onHideLoader() {
        this.view.$el.removeClass('is-loading');
        this.$loader.removeClass('show');
    },

    _onLoading() {
        const isLoading = this.view.model.get('loading');

        if (isLoading) {
            this.triggerMethod('show:loader');
        } else {
            this.triggerMethod('hide:loader');
        }
    }
});

export default Loader;
