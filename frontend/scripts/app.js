// Fake data for now — later this will come from your friend's backend API
const sampleArtworks = [
  {
    title: "Sunset Over Hills",
    artist: "Dev1",
    image_url: "https://placehold.co/300x200",
    description: "A calm evening scene."
  },
  {
    title: "City Lights",
    artist: "Dev1",
    image_url: "https://placehold.co/300x200",
    description: "Downtown at night."
  },
  {
    title: "Quiet Forest",
    artist: "Dev1",
    image_url: "https://placehold.co/300x200",
    description: "Morning light through trees."
  }
];

function renderGallery(artworks) {
  const grid = document.getElementById("gallery-grid");
  grid.innerHTML = ""; // clear anything already there

  artworks.forEach(art => {
    const card = document.createElement("div");
    card.className = "artwork-card";
    card.innerHTML = `
      <img src="${art.image_url}" alt="${art.title}">
      <h3>${art.title}</h3>
      <p>${art.artist}</p>
    `;
    grid.appendChild(card);
  });
}

// For now, just render the fake data immediately
renderGallery(sampleArtworks);