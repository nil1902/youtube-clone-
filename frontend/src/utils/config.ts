// Smart URL Config:
// In local development, routes directly to your Node Proxy (Port 5001)
// In Netlify Production, natively maps to the exact direct Lambda endpoint bypass proxy 404s!
export const API_URL = import.meta.env.PROD ? "/.netlify/functions/api" : "http://localhost:5001";
