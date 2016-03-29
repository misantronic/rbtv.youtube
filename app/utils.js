export let localStorage = {
    get: function (key) {
        let item = window.localStorage.getItem(key);

        try {
            item = JSON.parse(item);
        } catch(e) {

        }

        return item;
    },

    set: function (key, value) {
        try {
            value = JSON.stringify(value);
        } catch(e) {

        }

        window.localStorage.setItem(key, value);
    }
};