const path = require("path");
const {
	NodeFederationPlugin,
	StreamingTargetPlugin,
} = require("@module-federation/node");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

module.exports = {
	entry: {
		index: "./src/index.tsx",
		client: "./src/client.tsx",
	},
	devtool: false,
	mode: "development",
	output: {
		path: path.join(__dirname, "/dist/src"),
		libraryTarget: "commonjs-module",
	},
	target: "node",
	resolve: {
		extensions: [".tsx", ".ts", ".jsx", ".js"],
		plugins: [new TsconfigPathsPlugin()],
	},
	externals: {
		"@azure/functions": "@azure/functions",
		fs: "fs",
		path: "path",
		stream: "stream",
		buffer: "buffer",
		util: "util",
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: "babel-loader",
				exclude: /node_modules/,
				options: {
					presets: [
						["@babel/preset-react", { runtime: "automatic" }],
						"@babel/preset-typescript",
					],
				},
			},
		],
	},
	plugins: [
		new NodeFederationPlugin({
			name: "host",
			library: { type: "commonjs-module" },
			filename: "remote.js",
			remotes: {
				remote: "remote@http://localhost:8080/remote.js",
			},
		}),
		new StreamingTargetPlugin({
			name: "host",
			library: { type: "commonjs-module" },
			remotes: {
				remote: "remote@http://localhost:8080/remote.js",
			},
		}),
	],
};
