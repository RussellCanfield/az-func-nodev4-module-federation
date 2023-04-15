const path = require("path");
const { ModuleFederationPlugin } = require("webpack").container;
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

module.exports = {
	entry: {
		main: "./src/index",
	},
	mode: "development",
	output: {
		path: path.join(__dirname, "../api/dist/src"),
		publicPath: "http://localhost:7071/api/chunks/",
	},
	resolve: {
		extensions: [".ts", ".tsx", ".js"],
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
						["@babel/preset-react", { runtime: "automatic" }],
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
				remote: "remote@http://localhost:8080/remote.js",
			},
			exposes: {
				"./Provider": "./src/components/Provider",
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
	],
};
