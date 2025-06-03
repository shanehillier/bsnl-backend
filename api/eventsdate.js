import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end(); // End preflight
  }

  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ error: 'Missing date' });
  }

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('date', date);

  if (error) return res.status(500).json({ error: error.message });

  res.status(200).json(data);
}
