// Fake data for now — later this will come from the backend API
const sampleArtworks = [
  {
    id: 1,
    title: "Sunset Over Hills",
    artist: "Dev1",
    image_url: "https://placehold.co/500x360/EDEBE4/1C1C1A?text=",
    description: "A calm evening scene."
  },
  {
    id: 2,
    title: "City Lights",
    artist: "Dev1",
    image_url: "https://placehold.co/500x360/EDEBE4/1C1C1A?text=",
    description: "Downtown at night."
  },
  {
    id: 3,
    title: "Quiet Forest",
    artist: "Dev1",
    image_url: "https://placehold.co/500x360/EDEBE4/1C1C1A?text=",
    description: "Morning light through trees."
  }
];

function renderGallery(artworks) {
  const grid = document.getElementById("gallery-grid");
  if (!grid) return;
  grid.innerHTML = "";

  artworks.forEach(art => {
    const card = document.createElement("a");
    card.className = "artwork-card";
    card.href = `artwork-detail.html?id=${art.id}`;
    card.innerHTML = `
      <div class="frame">
        <img src="${art.image_url}" alt="${art.title}">
      </div>
      <div class="label">
        <p class="artist">${art.artist}</p>
        <p class="title">${art.title}</p>
      </div>
    `;
    grid.appendChild(card);
  });
}

function renderArtworkDetail() {
  const detailContainer = document.getElementById("artwork-detail");
  if (!detailContainer) return;

  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"));

  const artwork = sampleArtworks.find(art => art.id === id);

  if (!artwork) {
    detailContainer.innerHTML = "<p>Artwork not found.</p>";
    return;
  }

  detailContainer.innerHTML = `
    <div class="frame">
      <img src="${artwork.image_url}" alt="${artwork.title}" class="detail-image">
    </div>
    <div class="label">
      <p class="artist-name">${artwork.artist}</p>
      <p class="title">${artwork.title}</p>
    </div>
    <p class="description">${artwork.description}</p>
  `;
}

function setupAddArtworkForm() {
  const form = document.getElementById("add-artwork-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const newArtwork = {
      id: sampleArtworks.length + 1,
      title: document.getElementById("title").value,
      artist: document.getElementById("artist").value,
      image_url: document.getElementById("image_url").value || "https://placehold.co/500x360/EDEBE4/1C1C1A?text=",
      description: document.getElementById("description").value
    };

    sampleArtworks.push(newArtwork);

    alert("Artwork added! (Note: this is temporary until connected to a real backend)");
    window.location.href = "gallery.html";
  });
}

renderGallery(sampleArtworks);
renderArtworkDetail();
setupAddArtworkForm();