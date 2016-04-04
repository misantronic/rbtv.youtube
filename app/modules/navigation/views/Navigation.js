import {CollectionView, ItemView} from 'backbone.marionette'
import Config from '../../../Config'
import {props} from '../../decorators'

import '../../../../assets/css/navigation.scss'

class NavigationItem extends ItemView {

    @props({
        tagName: 'li',

        className: 'navigation-item',

        template: require('../templates/navigationItem.ejs'),

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

class Navigation extends CollectionView {

    @props({
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
    })

    initialize() {
        this.collection = Config.navigation;
    }
}

export {Navigation, NavigationItem}
export default Navigation