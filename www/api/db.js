var mongoose = require("mongoose");

var mongoURI = process.env.MONGOLAB_URI;

if (!mongoose.connection.readyState) {
    mongoose.connect(mongoURI, function (err, res) {
        if (err) {
            return console.log('Mongo: ERROR connecting to: ' + mongoURI + '. ' + err);
        }

        console.log('Mongo: Connected to: ' + mongoURI);
    });
}

module.exports = mongoose;