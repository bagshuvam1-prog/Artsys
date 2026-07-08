// Fake data for now — later this will come from your friend's backend API
const sampleArtworks = [
  {
    id: 1,
    title: "Sunset Over Hills",
    artist: "Dev1",
    image_url: "https://placehold.co/300x200",
    description: "A calm evening scene."
  },
  {
    id: 2,
    title: "City Lights",
    artist: "Dev1",
    image_url: "https://placehold.co/300x200",
    description: "Downtown at night."
  },
  {
    id: 3,
    title: "Quiet Forest",
    artist: "Dev1",
    image_url: "https://placehold.co/300x200",
    description: "Morning light through trees."
  }
];

function renderGallery(artworks) {
  const grid = document.getElementById("gallery-grid");
  grid.innerHTML = "";

  artworks.forEach(art => {
    const card = document.createElement("a");
    card.className = "artwork-card";
    card.href = `artwork-detail.html?id=${art.id}`;
    card.innerHTML = `
      <img src="${art.image_url}" alt="${art.title}">
      <h3>${art.title}</h3>
      <p>${art.artist}</p>
    `;
    grid.appendChild(card);
  });
}

renderGallery(sampleArtworks);
// Runs only on artwork-detail.html — checks the URL for an id and shows that artwork
function renderArtworkDetail() {
  const detailContainer = document.getElementById("artwork-detail");
  if (!detailContainer) return; // not on the detail page, skip

  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"));

  const artwork = sampleArtworks.find(art => art.id === id);

  if (!artwork) {
    detailContainer.innerHTML = "<p>Artwork not found.</p>";
    return;
  }

  detailContainer.innerHTML = `
    <img src="${artwork.image_url}" alt="${artwork.title}" class="detail-image">
    <h2>${artwork.title}</h2>
    <p class="artist-name">${artwork.artist}</p>
    <p>${artwork.description}</p>
  `;
}

renderArtworkDetail();