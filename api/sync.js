// Vercel serverless function — proxy to JSONBin to avoid CORS
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const JSONBIN_BASE = 'https://api.jsonbin.io/v3';

  if (req.method === 'GET') {
    const { binId, apiKey } = req.query;
    if (!binId || !apiKey) return res.status(400).json({ error: 'Missing binId or apiKey' });
    const r = await fetch(`${JSONBIN_BASE}/b/${binId}/latest`, {
      headers: { 'X-Master-Key': apiKey }
    });
    if (!r.ok) return res.status(r.status).json({ error: 'JSONBin error' });
    const data = await r.json();
    return res.status(200).json(data.record || {});
  }

  if (req.method === 'PUT') {
    const { binId, apiKey, data } = req.body || {};
    if (!binId || !apiKey || !data) return res.status(400).json({ error: 'Missing fields' });
    const r = await fetch(`${JSONBIN_BASE}/b/${binId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'X-Master-Key': apiKey },
      body: JSON.stringify(data)
    });
    if (!r.ok) return res.status(r.status).json({ error: 'JSONBin error' });
    return res.status(200).json({ ok: true });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
