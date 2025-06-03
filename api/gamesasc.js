import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {

  const { data, error } = await client
    .from('events')
    .select('*')
    .eq('game', true)
    .order('date', { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json(data);
}

