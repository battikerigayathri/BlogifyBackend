const axios = require("axios");

const UBER_AUTHORIZE_URL = "https://auth.uber.com/auth/v2/authorize";

function getUberAuthUrl() {
  const params = new URLSearchParams({
    client_id: process.env.UBER_CLIENT_ID,
    redirect_uri: "https://blogifybackend-tj2p.onrender.com/auth/uber/callback",
    response_type: "code",
    scope: "profile"
  });

  return `${UBER_AUTHORIZE_URL}?${params.toString()}`;
}

async function exchangeCodeForToken(code) {
  const url = "https://auth.uber.com/oauth/v2/token";

  const params = new URLSearchParams({
    client_id: process.env.UBER_CLIENT_ID,
    client_secret: process.env.UBER_CLIENT_SECRET,
    grant_type: "authorization_code",
    redirect_uri: "https://blogifybackend-tj2p.onrender.com/auth/uber/callback",
    code: code,
  });

  const response = await axios.post(url, params, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  return response.data;
}

module.exports = {
  getUberAuthUrl,
  exchangeCodeForToken,
};
