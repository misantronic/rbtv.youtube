import $ from 'jquery'
import _ from 'underscore'
import {Collection} from 'backbone'

const fetchFn = Collection.prototype.fetch;

Collection.prototype.fetch = function (options) {
    options = options || {};

    var self  = this;
    var defer = $.Deferred();

    fetchFn.call(this, _.extend(options, {
        success: function (/* data */) {
            defer.resolve(self);
        },

        error: function () {
            defer.reject.apply(self, arguments);
        }
    }));

    return defer.promise();
};