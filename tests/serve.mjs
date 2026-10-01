#!/usr/bin/env node

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, '..');

const rootDir = process.argv[2];
const port = parseInt(process.argv[3]);

if (!rootDir || !port) {
  console.error('Usage: node serve.mjs <rootDir> <port>');
  process.exit(1);
}

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon'
};

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${port}`);
  let path = url.pathname;
  
  // Handle root path
  if (path === '/') {
    path = '/index.html';
  }
  
  // Prevent path traversal
  if (path.includes('..')) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }
  
  const fullPath = join(rootDir, path);
  
  try {
    const stats = await stat(fullPath);
    
    if (stats.isDirectory()) {
      // Try index.html first, then fallback to .html
      const indexPath = join(fullPath, 'index.html');
      try {
        await stat(indexPath);
        return serveFile(res, indexPath);
      } catch {
        const htmlPath = fullPath + '.html';
        try {
          await stat(htmlPath);
          return serveFile(res, htmlPath);
        } catch {
          // If no index.html or .html, serve the directory as a file
          res.writeHead(404);
          res.end('Not Found');
        }
      }
    } else {
      return serveFile(res, fullPath);
    }
  } catch (err) {
    if (err.code === 'ENOENT') {
      // Serve 404.html if it exists, otherwise a basic 404
      try {
        const notFoundPath = join(rootDir, '404.html');
        await stat(notFoundPath);
        return serveFile(res, notFoundPath);
      } catch {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('This page doesn\'t exist.');
      }
    } else {
      res.writeHead(500);
      res.end('Internal Server Error');
    }
  }
});

function serveFile(res, filePath) {
  const ext = '.' + filePath.split('.').pop();
  const contentType = mimeTypes[ext] || 'application/octet-stream';
  
  res.writeHead(200, { 'Content-Type': contentType });
  
  readFile(filePath, { encoding: null })
    .then(data => {
      res.end(data);
    })
    .catch(err => {
      res.writeHead(500);
      res.end('Internal Server Error');
    });
}

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});