const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/check-live-uids', async (req, res) => {
  const { uid } = req.body;
  const response = await fetch(`https://graph.facebook.com/${uid}/picture?type=normal`);
  const isLive = /100x100/.test(response.url);
  res.json({ live: isLive });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
