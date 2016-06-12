var http = require('http');

var appUrl = 'http://rbtv-youtube.herokuapp.com';

setInterval(function () {
    console.log('keepalive: Refreshing app "'+ appUrl +'"...');
    http.get(appUrl);
}, 300000);
