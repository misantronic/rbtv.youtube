const HtmlWebpackPlugin  = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');

const NODE_ENV = process.env.NODE_ENV;

module.exports = {
    entry: {
        vendor: [
            'babel-polyfill',
            'jquery',
            'underscore',
            'backbone',
            'moment',
            __dirname + '/node_modules/bootstrap/js/tooltip',
            __dirname + '/node_modules/bootstrap/js/collapse',
            __dirname + '/node_modules/bootstrap/js/transition',
            'contextMenu',
            'react',
            'react-dom',
            'react-router',
            'react-select'
        ],
        application: __dirname + '/app/main.jsx'
    },

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
        new webpack.optimize.DedupePlugin(),

        new webpack.ProvidePlugin({
            _: 'underscore'
        }),

        new webpack.optimize.OccurenceOrderPlugin(true),

        new webpack.optimize.CommonsChunkPlugin('vendor', '[name].js'),

        new HtmlWebpackPlugin({
            template: __dirname + '/app/application.ejs',
            filename: 'index.html',
            inject: true
        }),

        new CleanWebpackPlugin(['public']),

        new webpack.DefinePlugin({
            LIVE_ID: JSON.stringify(process.env.LIVE_ID),
            YT_KEY: JSON.stringify(process.env.YT_KEY)
        })
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
            },
            {
                test: /contextMenu\/contextMenu\.js/,
                loader: 'imports?jQuery=jquery'
            }
        ],
        noParse: /\.min\.js/
    },

    devtool: 'sourcemap',

    debug: true
};
