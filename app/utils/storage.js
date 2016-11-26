const _ = require('underscore');

const storage = {
    get (key) {
        let item = localStorage.getItem(key);

        try {
            item = JSON.parse(item);
        } catch (e) {
            _.noop();
        }

        return item;
    },

    set(key, value) {
        try {
            value = JSON.stringify(value);
        } catch (e) {
            _.noop();
        }

        localStorage.setItem(key, value);
    },

    remove(key) {
        localStorage.removeItem(key);
    },

    update(key, props) {
        const keyValue = this.get(key) || {};

        this.set(key, _.extend(keyValue, props));
    },

    getVideoInfo(videoId) {
        return this.get(`${videoId}.info`) || {};
    },

    getMyChannelInfo() {
        return this.get('ytMyChannel') || {};
    }
};

module.exports = storage;
