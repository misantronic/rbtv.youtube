import {Behavior} from 'backbone.marionette'
import $ from 'jquery'

const Loader = Behavior.extend({
    modelEvents: {
        "change:loading": "_onLoading"
    },

    onShow() {
        const loaderHTML = require('./loader.ejs')();

        this.$loader = $(loaderHTML);

        this.view.$el.append(this.$loader);
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
        var isLoading = this.view.model.get('loading');

        if(isLoading) {
            this.triggerMethod('show:loader');
        } else {
            this.triggerMethod('hide:loader');
        }
    }
});

export default Loader