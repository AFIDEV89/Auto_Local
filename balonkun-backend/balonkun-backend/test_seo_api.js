import axios from 'axios';

const testSeo = async () => {
  try {
    // Brand 24 = Chevrolet, Cat 11 = Accessories, Vehicle Type 2 = 4W
    const response = await axios.get('http://localhost:5000/api/seo?c_id=11&v_b_id=24&v_id=2');
    console.log("=== API RESPONSE FOR CHEVROLET (BRAND ONLY) ===");
    if (response.data.data) {
        const d = response.data.data;
        console.log(`Title: ${d.seo_page_title}`);
        console.log(`Text Found: ${d.category_text?.includes('Chevrolet Car Accessories') ? 'YES - Brand Level' : 'NO - Stale/Model Level'}`);
        console.log(`ID: ${d.id}`);
    } else {
        console.log("No data returned");
    }
  } catch (error) {
    console.error("Error calling SEO API:", error.message);
  }
};

testSeo();
