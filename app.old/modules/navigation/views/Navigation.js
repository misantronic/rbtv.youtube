import {CollectionView, ItemView} from 'backbone.marionette';

const NavigationItem = ItemView.extend({

    tagName: 'li',

    className: 'navigation-item',

    template: require('../templates/navigation-item.ejs'),

    bindings: {
        ':el': {
            classes: {
                'active': '_active'
            }
        }
    },

    onRender() {
        this.stickit();
    }
});

const Navigation = CollectionView.extend({
    tagName: 'ul',

    className: 'navigation container nav nav-pills',

    childView: NavigationItem,

    bindings: {
        ':el': {
            classes: {
                'active': '_active'
            }
        }
    }
});

export {Navigation, NavigationItem};
export default Navigation;
