const http = require('http');
const { URL } = require('url');
const math = require('./mathUtils'); 
const server = http.createServer((req, res) => {
    const requestUrl = new URL(req.url, `http://${req.headers.host}`);
    const pathname = requestUrl.pathname;
    const queryParams = requestUrl.searchParams;

    const a = parseFloat(queryParams.get('a')) || 100;
    const b = parseFloat(queryParams.get('b')) || 50;

    if (pathname === '/api/math') {
        if (isNaN(a) || isNaN(b)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                error: 'Invalid numbers provided. Please use /api/math?a=X&b=Y',
                example: '/api/math?a=150&b=75'
            }, null, 2));
            return;
        }

        const result = {
            numA: a,
            numB: b,
            operation: 'add_subtract',
            addition: math.add(a, b),
            subtract: math.subtract(a, b),
            timestamp: new Date().toISOString()
        };

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result, null, 2));
        return;
    }

    res.writeHead(200, { 'Content-Type': 'text/html' });

    if (pathname === '/math') {
        let additionResult;
        let subtractionResult;
        let errorMessage = '';

        if (isNaN(a) || isNaN(b)) {
            errorMessage = `<p class="error">Invalid numbers provided. Please use /math?a=X&b=Y</p>`;
            additionResult = 'N/A';
            subtractionResult = 'N/A';
        } else {
            additionResult = math.add(a, b);
            subtractionResult = math.subtract(a, b);
        }

        res.end(`
                    <h1>Math Operation Results</h1>
                    ${errorMessage}
                    <p><strong>Number A:</strong> ${a}</p>
                    <p><strong>Number B:</strong> ${b}</p>
                    <hr>
                    <p><strong>Addition:</strong> <span class="result">${additionResult}</span></p>
                    <p><strong>Subtraction:</strong> <span class="result">${subtractionResult}</span></p>
                        <p>Try different numbers:</p>
                        <ul>
                            <li><a href="/math?a=200&b=75">/math?a=200&b=75 (HTML)</a></li>
                            <li><a href="/api/math?a=200&b=75">/api/math?a=200&b=75 (JSON)</a></li>
                        </ul>
        `);
        return;
    }
    res.end(`
        <h1>Welcome to the Math Operations Server</h1>
        <p>This server provides basic addition and subtraction.</p>
        <p><strong>HTML output:</strong> <a href="/math?a=100&b=50">/math?a=100&b=50</a></p>
        <p><strong>JSON output:</strong> <a href="/api/math?a=100&b=50">/api/math?a=100&b=50</a></p>
        <p>You can change 'a' and 'b' values in the URL.</p>
    `);
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Math server is running at http://localhost:${PORT}`);
    console.log(`HTML example: http://localhost:${PORT}/math?a=100&b=50`);
    console.log(`JSON example: http://localhost:${PORT}/api/math?a=100&b=50`);
});