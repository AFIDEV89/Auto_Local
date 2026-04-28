const http = require('http');

http.get('http://localhost:5000/api/seo?c_id=11&v_b_id=24&v_id=2', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log(JSON.parse(data));
  });
}).on('error', (err) => {
  console.log("Error: " + err.message);
});
