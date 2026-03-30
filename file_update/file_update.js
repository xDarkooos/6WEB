const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.argv[2] || 3000;

const DATA_FILE = path.join(__dirname, 'data.json');

const server = http.createServer((req, res) => {
  if (req.method === 'PUT' && /^\/data\/\d+$/.test(req.url)) {
    const id = parseInt(req.url.split('/')[2], 10);
    let body = '';

    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      let update;
      try {
        update = JSON.parse(body);
      } catch {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        return res.end('Malformed JSON');
      }

      fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          return res.end('data.json not found');
        }

        let items;
        try { items = JSON.parse(data); } catch {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          return res.end('Invalid data.json content');
        }

        const index = items.findIndex(item => item.id === id);
        if (index === -1) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          return res.end('Item not found');
        }

        items[index] = { ...items[index], ...update };

        fs.writeFile(DATA_FILE, JSON.stringify(items, null, 2), err => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            return res.end('Failed to write file');
          }
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(items[index]));
        });
      });
    });

  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  }
});

server.listen(PORT, () => console.log(`Server running at http://127.0.0.1:${PORT}/`));