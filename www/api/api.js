var activities = require('./endpoints/activities');

module.exports = {
	init: function (app) {
		app.get('/api/activities', activities);
	}
};