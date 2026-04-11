const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const ROOT_DIR = __dirname;

const MIME_TYPES = {
	".html": "text/html; charset=utf-8",
	".css": "text/css; charset=utf-8",
	".js": "application/javascript; charset=utf-8",
	".json": "application/json; charset=utf-8",
	".png": "image/png",
	".jpg": "image/jpeg",
	".jpeg": "image/jpeg",
	".gif": "image/gif",
	".svg": "image/svg+xml",
	".ico": "image/x-icon",
	".mp3": "audio/mpeg",
	".wav": "audio/wav",
	".ogg": "audio/ogg",
};

function safePath(urlPath) {
	const sanitized = urlPath.split("?")[0].split("#")[0];
	let decoded = sanitized;
	try {
		decoded = decodeURIComponent(sanitized);
	} catch (err) {
		decoded = sanitized;
	}
	const finalPath = decoded === "/" ? "/src/mainmenu.html" : decoded;
	return finalPath.replace(/^\/+/, "");
}

const server = http.createServer((req, res) => {
	const filePath = safePath(req.url || "/");
	const absolutePath = path.join(ROOT_DIR, filePath);

	fs.readFile(absolutePath, (err, data) => {
		if (err) {
			res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
			res.end("Arquivo nao encontrado.");
			return;
		}

		const ext = path.extname(absolutePath).toLowerCase();
		const contentType = MIME_TYPES[ext] || "application/octet-stream";
		res.writeHead(200, { "Content-Type": contentType });
		res.end(data);
	});
});

server.listen(PORT, () => {
	console.log(`Servidor rodando em http://localhost:${PORT}`);
});
