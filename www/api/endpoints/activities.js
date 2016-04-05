var request = require('./../request');

module.exports = function (req, res) {
	var query = req.query;

	request(res, 'activities', query);
};