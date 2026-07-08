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
// Runs only on add-artwork.html
function setupAddArtworkForm() {
  const form = document.getElementById("add-artwork-form");
  if (!form) return; // not on this page, skip

  form.addEventListener("submit", (e) => {
    e.preventDefault(); // stop page reload

    const newArtwork = {
      id: sampleArtworks.length + 1,
      title: document.getElementById("title").value,
      artist: document.getElementById("artist").value,
      image_url: document.getElementById("image_url").value || "https://placehold.co/300x200",
      description: document.getElementById("description").value
    };

    sampleArtworks.push(newArtwork); // add to fake data array (in-memory only for now)

    alert("Artwork added! (Note: this is temporary until connected to a real backend)");
    window.location.href = "gallery.html"; // send back to gallery
  });
}

setupAddArtworkForm();
form {
  display: flex;
  flex-direction: column;
  max-width: 400px;
  margin: 20px;
  gap: 10px;
}

form label {
  font-weight: bold;
  margin-top: 10px;
}

form input, form textarea {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

form button {
  margin-top: 15px;
  padding: 10px;
  background: #1a1a1a;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

form button:hover {
  background: #333;
}