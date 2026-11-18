// Verification server only: model a static host with real missing-page responses.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

export async function serveBuild(base = '/', port = 4176) {
  const root = path.resolve('dist');
  const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.mp4': 'video/mp4' };
  const server = createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      if (!pathname.startsWith(base)) throw new Error('Outside base');
      let file = path.resolve(root, pathname.slice(base.length) || '.');
      if (file !== root && !file.startsWith(`${root}${path.sep}`)) throw new Error('Outside build');
      if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html');
      let body = await readFile(file);
      const contentType = mime[path.extname(file)] || 'application/octet-stream';
      const headers = { 'Content-Type': contentType, Vary: 'Accept-Encoding' };
      if (/text|json|xml|svg/.test(contentType) && request.headers['accept-encoding']?.includes('gzip')) {
        body = gzipSync(body);
        headers['Content-Encoding'] = 'gzip';
      }
      response.writeHead(200, headers);
      response.end(body);
    } catch {
      response.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      response.end(await readFile(path.join(root, '404.html')));
    }
  });
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(port, '127.0.0.1', resolve); });
  return server;
}
