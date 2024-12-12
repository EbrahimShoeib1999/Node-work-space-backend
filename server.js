const http = require('http')
const app = require('./app')
require('./core/database'); // Ensure DB connection initializes

const port = process.env.PORT || 8000

const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
});

