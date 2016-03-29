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
    var keyValue = storageGet(storage, key) || {};

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