import {ItemView, CollectionView} from 'backbone.marionette'
import $ from 'jquery'
import app from '../../../application'
import {props} from '../../decorators'

class BreadcrumbItem extends ItemView {

    @props({
        tagName: 'li',

        className: 'breadcrumb-item',

        template: require('../templates/breadcrumb-item.ejs'),

        ui: {
            link: '.js-link'
        },

        events: {
            'click @ui.link': '_onClick'
        }
    })

    _onClick(e) {
        const $link = $(e.currentTarget);
        let route   = $link.attr('href');

        app.navigate(route);

        e.preventDefault();
    }
}

class Breadcrumb extends CollectionView {

    @props({
        tagName: 'ul',

        className: 'breadcrumb',

        childView: BreadcrumbItem
    })

    initialize() {
        
    }
}

export default Breadcrumb