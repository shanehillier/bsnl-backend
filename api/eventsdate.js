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

  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ error: 'Missing date' });
  }

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('date', date);

  if (error) return res.status(500).json({ error: error.message });

   const sortedData = data.sort((a, b) => {
    const aIsGame = !!a.game;
    const bIsGame = !!b.game;

    if (aIsGame === bIsGame) return 0;
    return aIsGame ? 1 : -1; // non-game first
  });

  res.status(200).json(data);
}
