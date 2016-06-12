import {CollectionView} from 'backbone.marionette';
import Tag from './Tag';

const Tags = CollectionView.extend({
    className: 'items-tags',

    childView: Tag,

    collectionEvents() {
        return {
            reset: () => {
                this.collection.length
                    ? this.show()
                    : this.hide();
            }
        };
    },

    show() {
        this.$el.show();

        return this;
    },

    hide() {
        this.$el.hide();

        return this;
    }
});

export default Tags;
