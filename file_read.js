const http = require('http');
const fs = require('fs');

const port = process.argv[2] || 3000;

const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/data') {
        
        fs.readFile('data.json', 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'File read error' }));
            }

            try {
                const jsonData = JSON.parse(data);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(jsonData));

            } catch (parseError) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
        });

    } else {
        res.writeHead(404);
        res.end();
    }
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});