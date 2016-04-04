import _ from 'underscore'

_.mixin({
    offset: function (arr, offset, length) {
        let newArr = [];

        for (let i = offset; i < offset + length; i++) {
            if (!arr[i]) break;

            newArr.push(arr[i]);
        }

        return newArr;
    },

    iintersection: function (array, ...rest) {
        array = _.map(array, (item) => {
            return _.isString(item) ? item.toLowerCase() : item;
        });

        return _.filter(_.uniq(array), function (item) {
            return _.every(rest, function (other) {

                other = _.map(other, (item) => {
                    return _.isString(item) ? item.toLowerCase() : item;
                });

                return _.indexOf(other, item) >= 0;
            });
        });
    }
});