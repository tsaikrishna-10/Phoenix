// Vercel serverless function: secure, allow-listed TMDB proxy.
module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const key = process.env.TMDB_API_KEY;
  if (!key) return res.status(500).json({ error: 'TMDB_API_KEY is missing from Vercel Environment Variables' });
  const { type, q, id, media } = req.query || {};
  let path;
  if (type === 'trending') path = '/trending/all/day';
  else if (type === 'search' && typeof q === 'string' && q.trim()) path = '/search/multi';
  else if (type === 'details' && /^\d+$/.test(String(id || '')) && ['movie','tv'].includes(media)) path = '/' + media + '/' + id;
  else return res.status(400).json({ error: 'Invalid TMDB request' });
  const url = new URL('https://api.themoviedb.org/3' + path);
  url.searchParams.set('api_key', key);
  url.searchParams.set('language', 'en-US');
  if (type === 'search') url.searchParams.set('query', q.trim().slice(0, 100));
  try {
    const upstream = await fetch(url.toString(), { headers: { accept: 'application/json' } });
    const data = await upstream.json();
    if (!upstream.ok) return res.status(upstream.status).json({ error: data.status_message || 'TMDB request failed' });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(502).json({ error: 'Could not reach TMDB' });
  }
};
