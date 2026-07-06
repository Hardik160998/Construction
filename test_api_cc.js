const http = require('http');

const data = JSON.stringify({
  customerType: 'Commercial',
  firstName: 'Test',
  lastName: 'User',
  email: 'testcommercial@test.com',
  phone: '1234567890',
  towerName: 'Tower A',
  flatName: 'Shop 100',
  flatNumber: '100',
  floor: '1',
  areaSqft: '500'
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/admin/customer',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let resData = '';
  res.on('data', (chunk) => {
    resData += chunk;
  });
  res.on('end', () => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Body: ${resData}`);
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.write(data);
req.end();
