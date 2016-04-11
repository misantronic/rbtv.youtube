var _       = require('underscore');
var Promise = require('promise');
var flatten = require('flat');
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
            .hgetall(identifier)
            .lrange(identifierItems, 0, -1)
            .exec()
            .then(results => {
                var valueMeta  = results[0][1];
                var valueItems = results[1][1];

                if (_.isEmpty(valueMeta) && valueItems.length === 0) {
                    return null;
                }

                // Parse meta-data
                valueMeta = flatten.unflatten(valueMeta);

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

        var pipeline, items;
        var identifier = cacheConfig.identifier;
        var expires    = cacheConfig.expires;

        // Look for items
        items = _.isArray(value) ? value : value.items || null;

        // Push items to redis
        if (items) {
            var list = _.map(items, item => {
                return JSON.stringify(item);
            });

            var identifierItems = this.rk2(identifier);

            pipeline = redis.pipeline();

            // Pipe items to pipeline
            _.each(items, item => {
                pipeline.rpush(this.rk2(identifier), JSON.stringify(item));
            });

            pipeline.exec();
        }

        // Set other parameters on redis
        if (_.isString(value)) {
            // String
            value = JSON.stringify(value);

            redis.set(identifier, value);
        } else if (_.isObject(value) || !_.isArray(value)) {
            // Object: Remove items-property
            value = _.omit(value, 'items');

            // Check if object is empty
            if (!_.isEmpty(value)) {
                items = flatten(value);

                pipeline = redis.pipeline();

                // Pipe items to pipeline
                _.each(items, (item, key) => {
                    pipeline.hmset(identifier, key, item);
                });

                pipeline.exec();
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
        var rest = _.chain(keys).rest().compact().value();

        if (rest.length) {
            key += '.' + rest.join(':');
        }

        return key;
    },

    rk2: function (identifier) {
        return this.rk(identifier, 'items');
    }
};