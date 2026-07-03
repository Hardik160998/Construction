const http = require('http');

const data = JSON.stringify({
  projectId: "8a623530-c59e-408d-85ae-79bd86f363ce",
  towerName: "Test Section",
  totalHouses: "50",
  numberSeries: "1-10"
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/admin/tower',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => console.log('Response:', res.statusCode, body));
});

req.on('error', error => console.error(error));
req.write(data);
req.end();
