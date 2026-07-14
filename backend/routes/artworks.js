const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'data', 'artworks.json');

function readArtworks() {
  const raw = fs.readFileSync(dataPath, 'utf-8');
  return JSON.parse(raw || '[]');
}

function writeArtworks(artworks) {
  fs.writeFileSync(dataPath, JSON.stringify(artworks, null, 2));
}

router.get('/', (req, res) => {
  const artworks = readArtworks();
  res.json(artworks);
});

router.get('/:id', (req, res) => {
  const artworks = readArtworks();
  const artwork = artworks.find(a => a.id === parseInt(req.params.id));
  if (!artwork) {
    return res.status(404).json({ error: 'Artwork not found' });
  }
  res.json(artwork);
});

router.post('/', (req, res) => {
  const artworks = readArtworks();

  const newArtwork = {
    id: Date.now(),
    title: req.body.title,
    artist: req.body.artist,
    image_url: req.body.image_url,
    description: req.body.description,
    year: req.body.year || "2026",
    medium: req.body.medium || "Mixed media"
  };

  artworks.push(newArtwork);
  writeArtworks(artworks);

  res.status(201).json(newArtwork);
});

router.put('/:id', (req, res) => {
  const artworks = readArtworks();
  const index = artworks.findIndex(a => a.id === parseInt(req.params.id));

  if (index === -1) {
    return res.status(404).json({ error: 'Artwork not found' });
  }

  artworks[index] = {
    ...artworks[index],
    title: req.body.title,
    artist: req.body.artist,
    image_url: req.body.image_url,
    description: req.body.description,
    year: req.body.year || artworks[index].year,
    medium: req.body.medium || artworks[index].medium
  };

  writeArtworks(artworks);
  res.json(artworks[index]);
});

router.delete('/:id', (req, res) => {
  const artworks = readArtworks();
  const index = artworks.findIndex(a => a.id === parseInt(req.params.id));

  if (index === -1) {
    return res.status(404).json({ error: 'Artwork not found' });
  }

  const removed = artworks.splice(index, 1);
  writeArtworks(artworks);
  res.json(removed[0]);
});

module.exports = router;