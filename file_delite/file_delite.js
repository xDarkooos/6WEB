const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.argv[2] || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

const server = http.createServer((req, res) => {
  // DELETE /data/:id
  if (req.method === 'DELETE' && req.url.startsWith('/data/')) {
    const id = parseInt(req.url.split('/')[2]);

    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
      if (err) {
        if (err.code === 'ENOENT') {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          return res.end('data.json does not exist');
        }
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        return res.end('Server error');
      }

      let items;
      try {
        items = JSON.parse(data);
        if (!Array.isArray(items)) throw new Error('Not an array');
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        return res.end('Malformed JSON');
      }

      const index = items.findIndex(item => item.id === id);
      if (index === -1) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        return res.end('ID not found');
      }

      const deleted = items.splice(index, 1)[0];

      fs.writeFile(DATA_FILE, JSON.stringify(items, null, 2), err => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          return res.end('Could not write file');
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(deleted));
      });
    });
  } else {
    
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://127.0.0.1:${PORT}/`);
});