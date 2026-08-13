import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { season } = req.query;

  if (Array.isArray(season)) {
    return res.status(400).json({
      error: 'Only one season value is allowed.'
    });
  }

  if (season && !['s1', 's2', 'all'].includes(season)) {
    return res.status(400).json({
      error: 'Invalid season. Use s1, s2, or all.'
    });
  }

  let query = supabase
    .from('teams')
    .select('*')
    .order('name', { ascending: true });

  if (season && season !== 'all') {
    query = query.eq('season', season);
  }

  const { data, error } = await query;

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json(data);
}