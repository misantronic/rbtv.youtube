var _       = require('underscore');
var Promise = require('promise');
var Redis   = require('ioredis');
var redis   = new Redis(process.env.REDIS_URL);

redis
    .on('connect', () => {
        console.log('Redis: Connected to:', process.env.REDIS_URL)
    })
    .on('reconnecting', () => {
        console.log('Redis: Reconnecting...');
    })
    .on('error', (err) => {
        console.error('Redis: Connection error', err);
    })
    .on('end', () => {
        console.log('Redis: Connection ended');
    });

/**
 * @param {String} identifier
 * @param {Number} [expires]
 * @constructor
 */
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
     */
    get: function (cacheConfig) {
        if (!cacheConfig) {
            callback(null, null);
            return;
        }

        var identifier = cacheConfig.identifier;
        var cacheKey   = identifier.length > 100 ? identifier.substr(0, 97) + '...' : identifier;

        console.time('Redis: Cache ' + cacheKey);

        return redis.get(identifier).then(data => {
            if (!_.isNull(data)) {
                console.timeEnd('Redis: Cache ' + cacheKey);
            }
        });
    },

    /**
     *
     * @param {CacheConfig} cacheConfig
     * @param {String} value
     */
    set: function (cacheConfig, value) {
        if (!cacheConfig) return;

        if (_.isObject(value)) {
            value = JSON.stringify(value);
        }

        var identifier = cacheConfig.identifier;
        var expires    = cacheConfig.expires;

        if (identifier) {
            redis.set(identifier, value);

            if (expires) {
                redis.expire(identifier, expires, (err, res) => {
                    if (err) {
                        return console.error('Redis: Error trying to set expire for ' + identifier + '. ' + err);
                    }

                    console.log('Redis: Expires in ' + expires);
                });
            }
        }
    },

    Config: CacheConfig,

    rk: function () {
        var keys = _.toArray(arguments);

        return keys[0] + '.' + _.rest(keys).join(':');
    }
};