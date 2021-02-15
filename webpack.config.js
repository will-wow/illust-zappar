const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: './src/index.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'index.js'
	},
	resolve: {
		extensions: [".js", ".wasm"]
	},
	plugins: [
		new HtmlWebpackPlugin({
			inject: "head",
			template: './src/index.html',
			filename: 'index.html'
		})
	],
	devServer: {
		contentBase: './dist',
		https: true,
		host: '0.0.0.0'
	},
	module: {
		rules: [
			{
				test: /zcv\.wasm$/,
				type: "javascript/auto",
				loader: "file-loader"
			  },
		{
			test: /\.html$/,
			use: {
				loader: 'html-loader',
				options: {
					attributes: {
						list: [
							{ tag: "img", attribute: "src", type: "src" },
							{ tag: "a-asset-item", attribute: "src", type: "src" }
						]
					}
				}
			}
		},
		{
			test: /\.(jpe?g|png|mp3|wav|zpt)$/,
			use: [
				{
					loader: 'file-loader',
					options: {
						name: '[path][name].[ext]?[hash:7]',
						context: 'src',
					},
				},
			],
		},
	]
	}
};