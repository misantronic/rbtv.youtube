import _ from 'underscore'

// props decorator
export function props(obj) {
    return function decorator(target) {
        _.each(obj, (val, key) => {
            target[key] = val;
        });
    }
}