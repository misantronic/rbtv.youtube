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
            return new Promise(function (resolve) {
                resolve(null);
            });
        }

        var identifier      = cacheConfig.identifier;
        var identifierItems = this.rk2(identifier);
        var logKey          = identifier.length > 100 ? identifier.substr(0, 97) + '...' : identifier;

        console.time('Redis: Cache ' + logKey);

        return redis
            .pipeline()
            .get(identifier)
            .lrange(identifierItems, 0, -1)
            .exec()
            .then(results => {
                var valueMeta  = results[0][1];
                var valueItems = results[1][1];

                if (!valueMeta && valueItems.length === 0) {
                    return null;
                }

                // Parse meta-data
                valueMeta = JSON.parse(valueMeta) || {};

                // Parse items
                if (valueItems.length !== 0) {
                    valueMeta.items = _.map(valueItems, item => {
                        return JSON.parse(item);
                    });
                }

                console.timeEnd('Redis: Cache ' + logKey);

                return valueMeta;
            });
    },

    /**
     *
     * @param {CacheConfig} cacheConfig
     * @param {*} value
     */
    set: function (cacheConfig, value) {
        if (!cacheConfig || !cacheConfig.identifier) return;

        var identifier = cacheConfig.identifier;
        var expires    = cacheConfig.expires;
        var identifierItems;

        // Look for items
        var items = _.isArray(value) ? value : value.items || null;

        // Push items to redis
        if (items) {
            var list = _.map(items, item => {
                return JSON.stringify(item);
            });

            identifierItems = this.rk2(identifier);

            redis.rpush.apply(redis, [].concat(identifierItems, list));
        }

        // Set other parameters on redis
        if (_.isObject(value) || !_.isArray(value)) {
            // Remove items-property
            value = _.omit(value, 'items');

            // Check if object is empty
            if (_.keys(value).length !== 0) {
                value = JSON.stringify(value);

                redis.set(identifier, value);
            }
        }

        // Set expire-parameter
        if (expires) {
            redis.expire(identifier, expires);

            if (identifierItems) {
                redis.expire(identifierItems, expires);
            }
        }
    },

    Config: CacheConfig,

    rk: function () {
        var keys = _.toArray(arguments);

        var key  = keys[0];
        var rest = _.rest(keys);

        console.log(key, rest);

        if(rest.length) {
            key += '.' + rest.join(':');
        }

        return key;
    },

    rk2: function (identifier) {
        return this.rk(identifier, 'items');
    }
};