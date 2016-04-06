var https   = require('https');
var param   = require('node-jquery-param');
var Promise = require('promise');
var cache   = require('./cache');

var key = 'AIzaSyD0WjzJ5761EemQ-lVor5er2JLR3PJGsGk';

/**
 * @param response
 * @param {String} endpoint
 * @param {Object} query
 * @param {CacheConfig} cacheConfig
 */
module.exports = function (response, endpoint, query, cacheConfig) {
    return new Promise(function(resolve, reject) {
        var requestData = () => {
            console.time('Request '+ endpoint);

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

                    var dataChunks = [];

                    res
                        .on('data', (chunk) => {
                            dataChunks.push(chunk);
                        })
                        .on('end', function () {
                            var data = Buffer.concat(dataChunks);

                            endRequest(res.statusCode, data);

                            console.timeEnd('Request '+ endpoint);

                            var dataStr = data.toString();

                            cache.set(cacheConfig, dataStr);

                            resolve(JSON.parse(dataStr));
                        });
                })
                .on('error', (e) => {
                    console.log(e);

                    reject();
                });
        };

        var endRequest = (statusCode, data) => {
            response.writeHead(statusCode, { "Content-Type": "application/json" });
            response.end(data);
        };

        cache.get(cacheConfig, function (err, value) {
            if (value) {
                endRequest(200, value);

                resolve(JSON.parse(value));
            } else {
                // Request live-data
                requestData();
            }
        });
    });
};