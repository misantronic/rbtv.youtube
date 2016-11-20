const cache = require('./../cache');
const fetch = require('../fetch');

module.exports = function (req, res) {
    const key = req.query.key;

    cache.delete(key);

    fetch.end(res, {success: true});
};
