require('newrelic');

var express     = require('express');
var timeout     = require('connect-timeout');
var compression = require('compression');
var bodyParser  = require('body-parser');
var api         = require('./api/api');

var publicPath = __dirname + '/../public';

var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(timeout('60s'));
app.use(compression());
app.use(express.static(publicPath));

// parse application/json
app.use(bodyParser.json({ limit: '5mb' }));

app.use(function (req, res, next) {
    if (!req.timedout) next();
});

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
