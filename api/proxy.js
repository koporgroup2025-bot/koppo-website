// api/proxy.js — Vercel Serverless Function
// โปรดใส่ GAS_WEB_APP_URL ใน Vercel Environment Variables

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const GAS_URL = process.env.GAS_WEB_APP_URL;
  if (!GAS_URL) {
    return res.status(500).json({ error: 'GAS_WEB_APP_URL not set in environment variables' });
  }

  try {
    let url = GAS_URL;
    let options = { redirect: 'follow' };

    if (req.method === 'GET') {
      const params = new URLSearchParams(req.query || {});
      url = `${GAS_URL}?${params.toString()}`;
      options.method = 'GET';
    } else {
      options.method  = 'POST';
      options.headers = { 'Content-Type': 'application/json' };
      options.body    = JSON.stringify(req.body);
    }

    const response = await fetch(url, options);
    const text     = await response.text();

    let data;
    try { data = JSON.parse(text); }
    catch { data = { error: 'Invalid response from GAS', raw: text }; }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
