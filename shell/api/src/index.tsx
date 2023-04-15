import { app } from "@azure/functions";
import { renderToPipeableStream, renderToString } from "react-dom/server";
import MemoryStream from "memory-stream";
import fs from "fs";
import path from "path";
import { App, Main } from "./client";
import { StaticRouter } from "react-router-dom/server";

app.http("getChunks", {
	route: "chunks/{*filePath}",
	methods: ["GET"],
	handler: (request, context) => {
		const { filePath } = request.params;
		return {
			body: fs.readFileSync(path.join(__dirname, filePath)),
		};
	},
});

app.http("app", {
	methods: ["GET"],
	handler: async (request, context) => {
		//This should really be using the Main component from func-client, but TS wasn't cooperating.
		const responseBody = await createResponseBody(<Main />);

		return {
			body: responseBody,
			headers: {
				"content-type": "text/html",
			},
		};
	},
});

async function createResponseBody(reactElement): Promise<string> {
	return new Promise((resolve) => {
		const outputStream = new MemoryStream();

		const assetMap = {
			"main.js": "/api/chunks/main.js",
		};

		const stream = renderToPipeableStream(reactElement, {
			onAllReady() {
				stream.pipe(outputStream);
				resolve(outputStream);
			},
			bootstrapScripts: [assetMap["main.js"]],
			bootstrapScriptContent: `window.assetMap = ${JSON.stringify(
				assetMap
			)};`,
		});
	});
}
