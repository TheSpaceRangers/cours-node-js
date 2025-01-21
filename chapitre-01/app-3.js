const http = require('http');

const server = http.createServer(
    (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Bonjour, Node.js  web server is running !\n');
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Serveur en cours d'execution sur http://localhost:${PORT}`);
});