const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

module.exports = {
	entry: "./src/index.ts",
	mode: "development",
	devtool: "source-map",
	output: {
		path: path.join(__dirname, "/dist"),
		clean: true,
		publicPath: "auto",
	},
	resolve: {
		extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
		plugins: [new TsconfigPathsPlugin()],
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: "babel-loader",
				exclude: /node_modules/,
				options: {
					presets: [
						"@babel/preset-react",
						"@babel/preset-typescript",
					],
				},
			},
		],
	},
	plugins: [
		new ModuleFederationPlugin({
			name: "remote",
			filename: "remote.js",
			remotes: {
				host: "host@http://localhost:7071/api/chunks/remote.js",
			},
			exposes: {
				"./Widget": "./src/components/Widget",
			},
			shared: {
				react: {
					singleton: true,
					requiredVersion: false,
				},
				"react-dom": {
					singleton: true,
					requiredVersion: false,
				},
			},
		}),
		new HtmlWebpackPlugin({
			template: "./public/index.html",
		}),
	],
};
