var _       = require('underscore');
var https   = require('https');
var param   = require('node-jquery-param');
var Promise = require('promise');
var cache   = require('./cache');

var key = 'AIzaSyD0WjzJ5761EemQ-lVor5er2JLR3PJGsGk';

function Config(options) {
    _.extend(this, options);
}

/** @type {CacheConfig} */
Config.prototype.cacheConfig = null;
Config.prototype.endpoint = null;
Config.prototype.query    = null;

/**
 * @param {Config} config
 * @return {Promise}
 */
function request(config) {
    var endpoint    = config.endpoint;
    var query       = config.query;
    var cacheConfig = config.cacheConfig;

    return new Promise(function (resolve, reject) {
        function resolvePromise(data, fromCache) {
            if(_.isString(data)) {
                data = JSON.parse(data);
            }

            resolve({
                data: data,
                fromCache: fromCache
            });
        }

        cache.get(cacheConfig)
            .then(value => {
                if (!_.isEmpty(_.omit(value, 'items')) && value.items) {
                    resolvePromise(value, true);
                    return;
                }

                // Request live-data
                console.time('Request ' + endpoint);

                https
                    .get({
                        hostname: 'www.googleapis.com',
                        port: 443,
                        path: '/youtube/v3/' + endpoint + '?' + param(query) + '&key=' + key,
                        method: 'GET',
                        headers: {
                            Origin: 'http://rbtv-youtube.herokuapp.com',
                            Referer: 'http://rbtv-youtube.herokuapp.com/api/activities'
                        }
                    }, (res) => {

                        var buffer = '';

                        res
                            .on('data', (chunk) => {
                                buffer += chunk;
                            })
                            .on('end', function () {
                                var dataStr = buffer.toString();
                                var dataObj = JSON.parse(dataStr);

                                console.timeEnd('Request ' + endpoint);

                                resolvePromise(dataObj, false);

                                cache.set(cacheConfig, dataObj);
                            });
                    })
                    .on('error', (e) => {
                        console.log(e);

                        reject();
                    });
            });
    });
}

/**
 *
 * @param response
 * @param {String} items
 */
request.end = function (response, items) {
    if(_.isObject(items)) {
        items = JSON.stringify(items);
    }

    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(items);
};

request.Config = Config;

module.exports = request;
