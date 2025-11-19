require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");
const { getUberAuthUrl} = require("./utils/Uberfunctions");
const axios = require("axios");

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

app.get("/", (req, res) => {
  res.send("Server is running");
});

// Step 1: Redirect to Uber Auth URL
app.get("/auth/uber", (req, res) => {
  res.redirect(getUberAuthUrl());
});

// Step 2: Uber redirects user back with ?code=xxx
app.get("/auth/uber/callback", async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).json({ error: "Authorization code missing" });
  }

  try {
    const tokenResponse = await exchangeCodeForToken(code);

    console.log("Uber Access Token Response:", tokenResponse);

    res.redirect("/dashboard?connected=uber");
  } catch (err) {
    console.error("Uber OAuth Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to exchange Uber auth code" });
  }
});

// Function to exchange Auth Code → Access Token
async function exchangeCodeForToken(code) {
  const url = "https://auth.uber.com/oauth/v2/token";

  const params = new URLSearchParams({
    client_id: process.env.UBER_CLIENT_ID,
    client_secret: process.env.UBER_CLIENT_SECRET,
    grant_type: "authorization_code",
    redirect_uri: "https://gayatri.com/auth/uber/callback",
    code: code,
  });

  const response = await axios.post(url, params, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  return response.data;
}

// Start server
app.listen(PORT, () => {
  console.log(`🌍 Server running on http://localhost:${PORT}`);
});
