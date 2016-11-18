const _ = require('underscore');

_.mixin({
    offset(arr, offset, length) {
        const newArr = [];

        for (let i = offset; i < offset + length; i++) {
            if (!arr[i]) break;

            newArr.push(arr[i]);
        }

        return newArr;
    },

    iintersection(array) {
        const rest = _.rest(arguments);

        array = _.map(array, item => _.isString(item) ? item.toLowerCase() : item);

        return _.filter(_.uniq(array), function (item) {
            return _.every(rest, function (other) {

                other = _.map(other, otherItem => _.isString(otherItem) ? otherItem.toLowerCase() : otherItem);

                return _.indexOf(other, item) >= 0;
            });
        });
    }
});
