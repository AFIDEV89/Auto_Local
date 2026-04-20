fetch("http://localhost:5000/api/v1/franchise/franchise-inquiry", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  }
})
.then(res => res.text())
.then(result => console.log("Response:", result.slice(0, 500)))
.catch(err => console.error("Error:", err));
