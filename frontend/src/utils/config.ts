// Smart URL Config:
// In local development, routes directly to your Node Proxy (Port 5001)
// In Netlify Production, utilizes relative routing ("") to trigger Netlify Serverless Functions seamlessly!
export const API_URL = import.meta.env.PROD ? "" : "http://localhost:5001";
