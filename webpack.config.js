var webpack            = require('webpack');
var HtmlWebpackPlugin  = require('html-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
	entry: {
		vendor: [
			'backbone',
			'backbone.radio',
			'backbone.marionette',
			'backbone.stickit',
			__dirname + '/app/vendor/marionette.radio.shim/radio.shim',
			'moment',
			__dirname + '/node_modules/bootstrap/js/tooltip',
			'fuckadblock'
		],
		application: __dirname + '/app/entry'
	},

	output: {
		path: __dirname + '/public',
		filename: '[name].js'
	},

	module: {
		loaders: [
			{ test: /\.ejs$/, loader: 'ejs-loader' },
			{ test: /\.css$/, loader: 'style-loader!css-loader' },
			{ test: /\.scss$/, loader: 'style-loader!css-loader!sass-loader' },
			{ test: /\.(jpe*g|png|gif|svg|woff2*|eot|ttf)$/, loader: 'file-loader?name=assets/[hash].[ext]' },
			{ test: /bootstrap\/js/, loader: 'imports?jQuery=jquery' },
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|vendor)/,
                loader: 'babel',
                query: {
                    presets: [
                        'es2015',
                        'stage-0',
                        'react'
                    ],
                    plugins: [
                        ["transform-decorators-legacy"]
                    ]
                }
            }
		]
	},

	plugins: [
		new webpack.optimize.DedupePlugin(),

		new webpack.ProvidePlugin({
			_: 'underscore'
		}),

		new webpack.optimize.OccurenceOrderPlugin(true),

		new webpack.optimize.CommonsChunkPlugin('vendor', '[name].js'),

		// exclude moment locales
		new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

		// new webpack.optimize.UglifyJsPlugin({
		// 	compress: {
		// 		warnings: false
		// 	}
		// }),

		new HtmlWebpackPlugin({
			template: __dirname + '/templates/index.ejs',
			filename: 'index.html',
			inject: true
		}),

		new CleanWebpackPlugin(['public'])
	],

	devtool: 'sourcemap',

	debug: true
};
