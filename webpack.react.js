var HtmlWebpackPlugin  = require('html-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var webpack = require('webpack');

var NODE_ENV = process.env.NODE_ENV;

module.exports = {
    entry: [
        'babel-polyfill',
        './react/main.jsx'
    ],

    output: {
        path: __dirname + '/public',
        filename: '[name].js'
    },

    resolve: {
        modulesDirectories: [
            'node_modules',
            'react'
        ],
        extensions: [
            '',
            '.webpack.js',
            '.web.js',
            '.js',
            '.jsx'
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: __dirname + '/app/application.ejs',
            filename: 'index.html',
            inject: true
        }),

        new CleanWebpackPlugin(['public'])
    ],

    module: {
        loaders: [
            { test: /\.ejs$/, loader: 'ejs-loader' },
            { test: /\.css$/, loader: 'style-loader!css-loader' },
            { test: /\.scss$/, loader: 'style-loader!css-loader!sass-loader' },
            { test: /\.(jpe*g|png|gif|svg|woff2*|eot|ttf)$/, loader: 'file-loader?name=assets/[hash].[ext]' },
            { test: /bootstrap\/js/, loader: 'imports?jQuery=jquery' },
            {
                test: /\.jsx?$/,
                loader: 'babel',
                exclude: /node_modules/,
                query: {
                    presets: [
                        'es2015',
                        'react'
                    ]
                }
            }
        ],
        noParse: /\.min\.js/
    },

    devtool: 'sourcemap',

    debug: true
};