const fetch = require('node-fetch');

async function test() {
  const res = await fetch('http://localhost:5000/api/payments/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: 100, orderId: "test1234", currency: "INR" })
  });
  const data = await res.json();
  console.log(res.status, data);
}

test();
