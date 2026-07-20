const express = require('express');
const cors = require('cors');
const artworksRoute = require('./routes/artworks');
const authRoute = require('./routes/auth');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use((req, res, next) => {
  console.log('INCOMING REQUEST:', req.method, req.url);
  next();
});

app.use('/artworks', artworksRoute);
app.use('/auth', authRoute);

app.get('/', (req, res) => {
  res.send('Artsys backend is running.');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});