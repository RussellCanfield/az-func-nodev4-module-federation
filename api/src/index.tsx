import { app } from "@azure/functions";
import { renderToPipeableStream } from "react-dom/server";
import MemoryStream from "memory-stream";
import fs from "fs";
import path from "path";
import Root from "./root";

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
		const responseBody = await createResponseBody(<Root />);

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
			// Careful: It's safe to stringify() this because this data isn't user-generated.
			bootstrapScriptContent: `window.assetMap = ${JSON.stringify(
				assetMap
			)};`,
		});
	});
}
