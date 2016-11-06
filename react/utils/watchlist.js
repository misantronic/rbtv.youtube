import _ from 'underscore';
import {Events} from 'backbone';
import storage from './storage';

const watchlist = {
    getList(type = null) {
        const list = storage.get('watchlist') || [];

        if (type) {
            return _.where(list, { type });
        }

        return list;
    },

    add(id, type = 'video') {
        const list = this.getList();
        const foundInList = this.has(id);

        if (!foundInList) {
            list.push({ id, type });

            storage.set('watchlist', list);

            this.trigger('added');
        }
    },

    remove(id) {
        const list = this.getList();

        const newList = _.filter(list, item => item.id !== id);

        storage.set('watchlist', newList);

        if(newList.length !== list.length) {
            this.trigger('removed');
        }
    },

    has(id) {
        const list = this.getList();

        return !!_.findWhere(list, { id });
    }
};

export default _.extend(watchlist, Events);
