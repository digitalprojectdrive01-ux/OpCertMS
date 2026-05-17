// Photo sync via JSONBin (separate bin per employee photo)
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const JSONBIN_BASE = 'https://api.jsonbin.io/v3';

  if (req.method === 'GET') {
    const { binId, apiKey } = req.query;
    if (!binId || !apiKey) return res.status(400).json({ error: 'Missing params' });
    try {
      const r = await fetch(`${JSONBIN_BASE}/b/${binId}/latest`, {
        headers: { 'X-Master-Key': apiKey }
      });
      if (!r.ok) return res.status(r.status).json({ error: 'Not found' });
      const data = await r.json();
      return res.status(200).json(data.record || null);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  if (req.method === 'PUT') {
    const { binId, apiKey, data } = req.body || {};
    if (!binId || !apiKey || !data) return res.status(400).json({ error: 'Missing fields' });
    // Try update first, then create
    let r = await fetch(`${JSONBIN_BASE}/b/${binId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'X-Master-Key': apiKey },
      body: JSON.stringify(data)
    });
    if (r.status === 404) {
      // Bin doesn't exist yet — create it
      r = await fetch(`${JSONBIN_BASE}/b`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': apiKey,
          'X-Bin-Name': binId,
          'X-Bin-Private': 'true'
        },
        body: JSON.stringify(data)
      });
    }
    if (!r.ok) return res.status(r.status).json({ error: 'JSONBin error' });
    return res.status(200).json({ ok: true });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
