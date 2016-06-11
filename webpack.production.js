var webpack = require('webpack');
var webpackConfig = require('./webpack.config');

webpackConfig.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
    })
);

webpackConfig.debug = false;

webpackConfig.devtool = null;

module.exports = webpackConfig;
