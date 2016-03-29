import {ItemView, CollectionView} from 'backbone.marionette'
import $ from 'jquery'
import app from '../../../application'

class BreadcrumbItem extends ItemView {
    get tagName() {
        return 'li'
    }

    get className() {
        return 'breadcrumb-item'
    }

    get template() {
        return require('../templates/breadcrumbItem.ejs');
    }

    ui() {
        return {
            link: '.js-link'
        }
    }

    events() {
        return {
            'click @ui.link': '_onClick'
        };
    }

    _onClick(e) {
        var $link = $(e.currentTarget);
        var route = $link.attr('href');

        app.navigate(route);

        e.preventDefault();
    }
}

class Breadcrumb extends CollectionView {
    get tagName() {
        return 'ul'
    }

    get className() {
        return 'breadcrumb'
    }

    get childView() {
        return BreadcrumbItem
    }
}

export default Breadcrumb