const data = {
  contact_person_name: "Test User",
  email: "test_franchise@example.com",
  mobile_number: "9876543210",
  store_name: "Autoform Demo Store",
  location: "New Delhi",
  store_area: "1500",
  category: "4-Wheeler"
};

fetch("http://localhost:5000/api/v1/franchise/franchise-inquiry", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(data)
})
.then(res => res.json())
.then(result => console.log("Response:", result))
.catch(err => console.error("Error:", err));
