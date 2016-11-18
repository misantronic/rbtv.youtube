import $ from 'jquery';
import _ from 'underscore';
import {Collection} from 'backbone';

const fetchFn = Collection.prototype.fetch;

Collection.prototype.fetch = function (options) {
    options = options || {};

    const self  = this;
    const defer = $.Deferred();

    const xhr = fetchFn.call(this, _.extend(options, {
        success(/* data */) {
            defer.resolve(self);
        },

        error() {
            defer.reject.apply(self, arguments);
        }
    }));

    const promise = defer.promise();

    // Add abort-method from xhr
    promise.abort = xhr.abort;

    return promise;
};
