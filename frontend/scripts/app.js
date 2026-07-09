const sampleArtworks = [
  {
    id: 1,
    title: "Sunset Over Hills",
    artist: "Dev1",
    image_url: "https://placehold.co/700x520/EDEBE4/1E1D1A?text=",
    description: "A calm evening scene rendered in soft, warm tones — light falling across a quiet ridge line just before dusk.",
    year: "2026",
    medium: "Oil on canvas"
  },
  {
    id: 2,
    title: "City Lights",
    artist: "Dev1",
    image_url: "https://placehold.co/700x520/EDEBE4/1E1D1A?text=",
    description: "Downtown at night, seen from a distance — a study in scattered light and long shadow.",
    year: "2026",
    medium: "Digital photography"
  },
  {
    id: 3,
    title: "Quiet Forest",
    artist: "Dev1",
    image_url: "https://placehold.co/700x520/EDEBE4/1E1D1A?text=",
    description: "Morning light through trees, captured in the stillness just after dawn.",
    year: "2026",
    medium: "Mixed media"
  }
];

function setupHeaderScroll() {
  const header = document.getElementById("site-header");
  if (!header) return;
  window.addEventListener("scroll", () => {
    if (window.scrollY > 10) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });
}

function renderFeatured() {
  const container = document.getElementById("featured-artwork");
  if (!container) return;

  const artwork = sampleArtworks[0];
  if (!artwork) return;

  container.innerHTML = `
    <div class="frame">
      <img src="${artwork.image_url}" alt="${artwork.title}">
    </div>
    <div class="label">
      <p class="artist">${artwork.artist}</p>
      <p class="title">${artwork.title}</p>
      <a href="artwork-detail.html?id=${artwork.id}" class="view-link">View Artwork →</a>
    </div>
  `;
}

function renderGallery(artworks) {
  const grid = document.getElementById("gallery-grid");
  if (!grid) return;
  grid.innerHTML = "";

  artworks.forEach((art, index) => {
    const card = document.createElement("a");
    card.className = "artwork-card fade-in";
    if (index % 3 === 0) {
      card.classList.add("card-large");
    }
    card.href = `artwork-detail.html?id=${art.id}`;
    card.innerHTML = `
      <div class="frame">
        <img src="${art.image_url}" alt="${art.title}">
      </div>
      <div class="label">
        <p class="artist">${art.artist}</p>
        <p class="title">${art.title}</p>
        <p class="meta">${art.medium || ""}${art.medium && art.year ? " · " : ""}${art.year || ""}</p>
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
  const index = sampleArtworks.findIndex(art => art.id === id);
  const artwork = sampleArtworks[index];

  if (!artwork) {
    detailContainer.innerHTML = "<p>Artwork not found.</p>";
    return;
  }

  detailContainer.innerHTML = `
    <div class="detail-grid">
      <div class="frame">
        <img src="${artwork.image_url}" alt="${artwork.title}" class="detail-image">
      </div>
      <div class="detail-info">
        <p class="artist-name">${artwork.artist}</p>
        <p class="title">${artwork.title}</p>
        <p class="meta-line">${artwork.medium || "Medium unlisted"} · ${artwork.year || "Year unknown"}</p>
        <hr>
        <p class="description">${artwork.description}</p>
      </div>
    </div>
  `;

  renderDetailNav(index);
}

function renderDetailNav(index) {
  const navContainer = document.getElementById("detail-nav");
  if (!navContainer) return;

  const total = sampleArtworks.length;
  const prev = sampleArtworks[(index - 1 + total) % total];
  const next = sampleArtworks[(index + 1) % total];
  const counter = `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;

  navContainer.innerHTML = `
    <div class="detail-nav">
      <a href="artwork-detail.html?id=${prev.id}">← Previous</a>
      <span class="counter">${counter}</span>
      <a href="artwork-detail.html?id=${next.id}">Next →</a>
    </div>
  `;
}

function setupDropzone() {
  const dropzone = document.getElementById("dropzone");
  const urlInput = document.getElementById("image_url");
  const preview = document.getElementById("image-preview");
  const dropzoneText = document.getElementById("dropzone-text");
  if (!dropzone || !urlInput) return;

  function updatePreview() {
    const url = urlInput.value.trim();
    if (url) {
      preview.src = url;
      preview.style.display = "block";
      dropzoneText.style.display = "none";
    } else {
      preview.style.display = "none";
      dropzoneText.style.display = "block";
    }
  }

  urlInput.addEventListener("input", updatePreview);
  dropzone.addEventListener("click", () => urlInput.focus());

  dropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropzone.classList.add("dragover");
  });
  dropzone.addEventListener("dragleave", () => {
    dropzone.classList.remove("dragover");
  });
  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.classList.remove("dragover");
    const url = e.dataTransfer.getData("text/uri-list") || e.dataTransfer.getData("text/plain");
    if (url) {
      urlInput.value = url;
      updatePreview();
    }
  });
}

function setupAddArtworkForm() {
  const form = document.getElementById("add-artwork-form");
  if (!form) return;

  setupDropzone();

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const newArtwork = {
      id: sampleArtworks.length + 1,
      title: document.getElementById("title").value,
      artist: document.getElementById("artist").value,
      image_url: document.getElementById("image_url").value || "https://placehold.co/700x520/EDEBE4/1E1D1A?text=",
      description: document.getElementById("description").value,
      year: "2026",
      medium: "Mixed media"
    };

    sampleArtworks.push(newArtwork);

    alert("Artwork added to the collection! (Temporary — resets until connected to a real backend)");
    window.location.href = "gallery.html";
  });
}

setupHeaderScroll();
renderFeatured();
renderGallery(sampleArtworks);
renderArtworkDetail();
setupAddArtworkForm();