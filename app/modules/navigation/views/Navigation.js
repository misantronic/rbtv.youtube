import {CollectionView, ItemView} from 'backbone.marionette'
import {Collection} from 'backbone'
import Config from '../../../Config'

import '../../../../assets/css/navigation.scss'

class NavigationItem extends ItemView {
    get tagName() {
        return 'li'
    }

    get className() {
        return 'navigation-item'
    }

    get template() {
        return require('../templates/navigationItem.ejs');
    }

    bindings() {
        return {
            ':el': {
                classes: {
                    'active': '_active'
                }
            }
        }
    }

    onRender() {
        this.stickit();
    }
}

class Navigation extends CollectionView {
    get tagName() {
        return 'ul'
    }

    get className() {
        return 'navigation container nav nav-pills'
    }

    get childView() {
        return NavigationItem
    }

    initialize() {
        this.collection = Config.navigation;
    }
}

export {Navigation, NavigationItem}
export default Navigation