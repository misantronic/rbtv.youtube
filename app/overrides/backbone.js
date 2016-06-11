import $ from 'jquery';
import _ from 'underscore';
import {Collection} from 'backbone';

const fetchFn = Collection.prototype.fetch;

Collection.prototype.fetch = function (options) {
    options = options || {};

    const self  = this;
    const defer = $.Deferred();

    fetchFn.call(this, _.extend(options, {
        success(/* data */) {
            defer.resolve(self);
        },

        error() {
            defer.reject.apply(self, arguments);
        }
    }));

    return defer.promise();
};
