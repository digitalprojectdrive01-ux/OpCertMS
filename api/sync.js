export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  const BASE = 'https://api.jsonbin.io/v3';
  try {
    if (req.method === 'GET') {
      const { binId, apiKey } = req.query;
      if (!binId || !apiKey) return res.status(400).json({ error: 'Missing params' });
      const r = await fetch(`${BASE}/b/${binId}/latest`, { headers: { 'X-Master-Key': apiKey } });
      if (!r.ok) return res.status(r.status).json({ error: 'JSONBin error' });
      const d = await r.json();
      return res.json(d.record || {});
    }
    if (req.method === 'PUT') {
      const { binId, apiKey, data } = req.body || {};
      if (!binId || !apiKey || !data) return res.status(400).json({ error: 'Missing fields' });
      const r = await fetch(`${BASE}/b/${binId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-Master-Key': apiKey },
        body: JSON.stringify(data)
      });
      if (!r.ok) return res.status(r.status).json({ error: 'JSONBin error' });
      return res.json({ ok: true });
    }
  } catch(e) { return res.status(500).json({ error: e.message }); }
  res.status(405).json({ error: 'Method not allowed' });
}
