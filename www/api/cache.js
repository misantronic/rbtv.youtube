var _       = require('underscore');
var Promise = require('promise');
var rtg     = require('url').parse(process.env.REDIS_URL);
var redis   = require('redis').createClient(process.env.REDIS_URL);


function CacheConfig(identifier, expires) {
    this.identifier = identifier;
    this.expires    = expires || 300;
}

/** @type {String} */
CacheConfig.prototype.identifier = null;
/** @type {moment} */
CacheConfig.prototype.expires = null;

module.exports = {

    /**
     *
     * @param {CacheConfig} cacheConfig
     * @param {Function} callback
     */
    get: function (cacheConfig, callback) {
        if (!cacheConfig) {
            callback(null, null);
            return;
        }

        var identifier = cacheConfig.identifier;
        var cacheKey   = identifier.length > 100 ? identifier.substr(0, 97) + '...' : identifier;

        console.time('Cache ' + cacheKey);

        redis.get(identifier, (err, data) => {
            if (!_.isNull(data)) {
                console.timeEnd('Cache ' + cacheKey);
            }

            callback(err, data);
        });
    },

    /**
     *
     * @param {CacheConfig} cacheConfig
     * @param {*} value
     */
    set: function (cacheConfig, value) {
        var identifier = cacheConfig.identifier;
        var expires    = cacheConfig.expires;

        if (identifier) {
            redis.set(identifier, value, redis.print);

            if (expires) {
                redis.expire(identifier, expires, (err, res) => {
                    if (err) {
                        return console.error('Error trying to set expire for ' + identifier + '. ' + err);
                    }

                    console.log('Expires in ' + expires);
                });
            }
        }
    },

    Config: CacheConfig
};