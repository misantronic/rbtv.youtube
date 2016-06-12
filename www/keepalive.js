var http = require('http');

var appUrl = 'http://rbtv-youtube.herokuapp.com';

console.log('Running keepalive...');

setInterval(function () {
    console.log('keepalive: Refreshing app "'+ appUrl +'"...');
    http.get(appUrl);
}, 300000);
