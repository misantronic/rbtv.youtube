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
			'bootstrap',
			'tether'
		],
		application: __dirname + '/app/entry'
	},

	output: {
		path: __dirname + '/public',
		filename: '[name].js'
	},

	module: {

		preLoaders: [],

		loaders: [
			{ test: /\.ejs$/, loader: 'ejs-loader' },
			{ test: /\.css$/, loader: 'style-loader!css-loader' },
			{ test: /\.scss$/, loader: 'style-loader!css-loader!sass-loader' },
			{ test: /\.(jpe*g|png|gif|svg|woff2*|eot|ttf)$/, loader: 'file-loader?name=assets/[hash].[ext]' },
			{ test: /bootstrap\/js/, loader: 'imports?jQuery=jquery,Tether=tether' },
			{
				test: /\.jsx?$/,
				exclude: /(node_modules|bower_components|vendor)/,
				loader: 'babel',
				query: {
					presets: ['es2015']
				}
			}
		]
	},

	resolve: {
		modulesDirectories: ['node_modules']
	},

	plugins: [
		new webpack.optimize.DedupePlugin(),

		new webpack.ProvidePlugin({
			_: 'underscore',
			'window.Tether': 'tether'
		}),

		new webpack.optimize.OccurenceOrderPlugin(true),

		new webpack.optimize.CommonsChunkPlugin('vendor', '[name].js'),

		// exclude moment locales
		new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

		new HtmlWebpackPlugin({
			template: __dirname + '/templates/index.html',
			filename: 'index.html',
			inject: true
		}),

		new CleanWebpackPlugin(['public'], {
			root: __dirname,
			verbose: true,
			dry: false
		})
	],

	devtool: 'sourcemap',

	debug: true
};
