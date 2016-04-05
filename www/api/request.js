var https = require('https');
var param = require('node-jquery-param');

var key = 'AIzaSyD0WjzJ5761EemQ-lVor5er2JLR3PJGsGk';

module.exports = function (response, endpoint, query) {
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

			var bodyChunks = [];

			res
				.on('data', (chunk) => {
					bodyChunks.push(chunk);
				})
				.on('end', function () {
					var body = Buffer.concat(bodyChunks);

					response.writeHead(res.statusCode, {"Content-Type": "application/json"});
					response.end(body);
				});
		})
		.on('error', (e) => {
			console.log(e);
		});
};