import http from 'http';

const url = 'http://localhost:5000/api/v1/seo?c_id=11&v_id=2&sc_id=3';

console.log('Fetching SEO metadata with full error logging...');

http.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        console.log('Response Status:', res.statusCode);
        try {
            const j = JSON.parse(data);
            console.log('Body:', JSON.stringify(j, null, 2));
        } catch (e) {
            console.log('Raw Data:', data);
        }
    });
}).on('error', (err) => {
    console.error('Error:', err.message);
});
