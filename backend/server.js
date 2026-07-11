const express = require('express');
const cors = require('cors');
const artworksRoute = require('./routes/artworks');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use('/artworks', artworksRoute);

app.get('/', (req, res) => {
  res.send('Artsys backend is running.');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});