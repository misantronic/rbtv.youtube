import {CollectionView, ItemView} from 'backbone.marionette';
import Config from '../../../Config';
import {props} from '../../decorators';

class NavigationItem extends ItemView {

    @props({
        tagName: 'li',

        className: 'navigation-item',

        template: require('../templates/navigation-item.ejs'),

        bindings: {
            ':el': {
                classes: {
                    'active': '_active'
                }
            }
        }
    })

    onRender() {
        this.stickit();
    }
}

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
