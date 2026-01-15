const express = require('express');
const supabase = require('./supaClient');
const craeSite = require('./crawSites')
const CronJob = require('./cronJob')

const cors = require('cors');

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET'],
}));
app.get('/search', async (req, res) => {
  const q = req.query.q;

  if (!q) {
    return res.status(400).json({ error: 'Query is required' });
  }

  // simple full-text search
  const { data, error } = await supabase
    .rpc('fts_products', { query: q });

  if (error) {
    return res.status(500).json({ error: error.message });
  }


  res.json(data);
});

app.listen(4000, () => console.log('Search API running on port 4000'));