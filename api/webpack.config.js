const path = require("path");
const {
	NodeFederationPlugin,
	StreamingTargetPlugin,
} = require("@module-federation/node");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

module.exports = {
	entry: {
		main: "./src/noop.js",
	},
	mode: "development",
	output: {
		path: path.join(__dirname, "/dist/src"),
		clean: true,
	},
	target: "web",
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
