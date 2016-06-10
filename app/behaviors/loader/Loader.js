import {Behavior} from 'backbone.marionette'
import _ from 'underscore'
import $ from 'jquery'

class Loader extends Behavior {
    onShow() {
        const loaderHTML = require('./loader.ejs')();

        this.$loader = $(loaderHTML);

        this.view.$el.append(this.$loader);
    }

    onDestroy() {
        this.$loader.remove();
    }

    onShowLoader() {
        this.view.$el.addClass('is-loading');
        this.$loader.addClass('show');
    }

    onHideLoader() {
        this.view.$el.removeClass('is-loading');
        this.$loader.removeClass('show');
    }
}

export default Loader