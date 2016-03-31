import $ from 'jquery'
import {Behavior} from 'backbone.marionette'
import template from './BtnToTop.ejs'

class BtnToTop extends Behavior {

    events() {
        return {
            'click .js-btn-to-top': '_onBtnToTop'
        }
    }

    onRender() {
        // Add template
        this.$el.find('.js-btn-to-top').remove();
        this.$el.append(template);

        // Add scrolling
        $(window).on('scroll.behavior.btnToTop', this._onScroll.bind(this));

        // Bind stickit
        this.view.addBinding(null, '.js-btn-to-top', {
            classes: {
                show: '_showBtnToTop'
            }
        });

        this.view.stickit(this.view.model);
    }

    onDestroy() {
        $(window).off('scroll.behavior.btnToTop');
    }

    _onBtnToTop(e) {
        $('html, body').animate({ scrollTop: 0 }, 500);

        e.preventDefault();
    }

    _onScroll() {
        const y = window.scrollY;

        this.view.model.set('_showBtnToTop', y >= window.innerHeight)
    }
}

export default BtnToTop