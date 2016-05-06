import _ from 'underscore'

function storageGet(storage, key, property = null) {
    let item = window[storage].getItem(key);

    try {
        item = JSON.parse(item);
    } catch (e) {

    }

    if (property && _.isObject(item)) {
        return item[property]
    }

    return item;
}

function storageSet(storage, key, value) {
    try {
        value = JSON.stringify(value);
    } catch (e) {

    }

    window[storage].setItem(key, value);
}

function storageUpdate(storage, key, properties) {
    let keyValue = storageGet(storage, key) || {};

    storageSet(storage, key, _.extend(keyValue, properties));
}

export const localStorage = {
    get: function (key, property = null) {
        return storageGet('localStorage', key, property)
    },

    set: function (key, value) {
        storageSet('localStorage', key, value);
    },

    update: function (key, properties) {
        storageUpdate('localStorage', key, properties);
    }
};

export const sessionStorage = {
    get: function (key, property = null) {
        return storageGet('sessionStorage', key, property)
    },

    set: function (key, value) {
        storageSet('sessionStorage', key, value);
    },

    update: function (key, properties) {
        storageUpdate('sessionStorage', key, properties);
    }
};

export const timeUtil = {
    /**
     *
     * @param {String} position
     * @returns {Number}
     */
    videoPositionToSeconds: function (position) {
        return position.replace(/(?:(\d+)h){0,1}(?:(\d+)m){0,1}(?:(\d+)s){0,1}/, (str, hour, min, sec) => {
            hour = parseInt(hour) || 0;
            min  = parseInt(min) || 0;
            sec  = parseInt(sec) || 0;

            return hour * 60 * 60 + min * 60 + sec;
        });
    }
};

export const stringUtil = {
    formatNumber: function (number) {
        return parseInt(number).toLocaleString('de-DE');
    }
};