var express     = require('express');
var compression = require('compression');
var api         = require('./api/api');

var publicPath = __dirname + '/../public';

var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(compression());
app.use(express.static(publicPath));

// views is directory for all template files
app.set('views', publicPath);
app.set('view engine', 'ejs');

app.get('/', function (request, response) {
	response.render('index');
});

api.init(app);

app.listen(app.get('port'), function () {
	console.log('Node app is running on port', app.get('port'));
});