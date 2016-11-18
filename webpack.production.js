const webpack = require('webpack');
const webpackConfig = require('./webpack.react');

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
