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
Config.prototype.response = null;
Config.prototype.endpoint = null;
Config.prototype.query    = null;
Config.prototype.items    = null;

/**
 * @param {Config} config
 * @return {Promise}
 */
function request(config) {
    var response    = config.response;
    var endpoint    = config.endpoint;
    var query       = config.query;
    var cacheConfig = config.cacheConfig;
    var items       = config.items || [];

    return new Promise(function (resolve, reject) {
        var requestData = () => {
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

                            endRequest(res.statusCode, dataObj);

                            console.timeEnd('Request ' + endpoint);

                            resolve({ data: dataObj });

                            cache.set(cacheConfig, dataStr);
                        });
                })
                .on('error', (e) => {
                    console.log(e);

                    reject();
                });
        };

        var endRequest = (statusCode, data) => {
            var dataIsObject = _.isObject(data);

            if(items.length && dataIsObject) {
                data.items = data.items.concat(items);
            }

            response.writeHead(statusCode, { "Content-Type": "application/json" });
            response.end(
                dataIsObject ? JSON.stringify(data) : data
            );
        };

        var processCache = (err, value) => {
            if (value) {
                endRequest(200, value);

                resolve({
                    data: JSON.parse(value),
                    fromCache: true
                });
            } else {
                // Request live-data
                requestData();
            }
        };

        if (endpoint === 'videos' && !query.id && items.length) {
            processCache(null, JSON.stringify({ items: items }));
        } else {
            cache.get(cacheConfig, processCache);
        }
    });
}

request.Config = Config;

module.exports = request;