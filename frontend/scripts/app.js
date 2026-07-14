const API_URL = "http://localhost:3000/artworks";

const sampleArtworks = [
  {
    id: 1,
    title: "Sunset Over Hills",
    artist: "Dev1",
    image_url: "https://wallpaperbat.com/img/19063123-wallpaper-forest-river-sunset-art.jpg",
    description: "A calm evening scene rendered in soft, warm tones — light falling across a quiet ridge line just before dusk.",
    year: "2026",
    medium: "Oil on canvas",
    isFixed: true
  },
  {
    id: 2,
    title: "City Lights",
    artist: "Dev1",
    image_url: "https://wallpaperaccess.com/full/1883962.jpg",
    description: "Downtown at night, seen from a distance — a study in scattered light and long shadow.",
    year: "2026",
    medium: "Digital photography",
    isFixed: true
  },
  {
    id: 3,
    title: "Quiet Forest",
    artist: "Dev1",
    image_url: "https://tse1.explicit.bing.net/th/id/OIP.42y1YXQsBQuFe95n6H6DZQAAAA?r=0&cb=thfc1falcon4&rs=1&pid=ImgDetMain&o=7&rm=3",
    description: "Morning light through trees, captured in the stillness just after dawn.",
    year: "2026",
    medium: "Mixed media",
    isFixed: true
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

async function getAllArtworks() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Failed to load artworks");
    const backendArtworks = await response.json();
    return [...sampleArtworks, ...backendArtworks];
  } catch (err) {
    console.error("Could not reach backend, showing fixed artworks only:", err);
    return [...sampleArtworks];
  }
}

async function renderFeatured() {
  const container = document.getElementById("featured-artwork");
  if (!container) return;

  const artworks = await getAllArtworks();
  const artwork = artworks[0];
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

async function renderGallery() {
  const grid = document.getElementById("gallery-grid");
  if (!grid) return;

  const artworks = await getAllArtworks();
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

async function renderArtworkDetail() {
  const detailContainer = document.getElementById("artwork-detail");
  if (!detailContainer) return;

  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"));

  const artworks = await getAllArtworks();
  const index = artworks.findIndex(art => art.id === id);
  const artwork = artworks[index];

  if (!artwork) {
    detailContainer.innerHTML = "<p>Artwork not found.</p>";
    return;
  }

  const actionButtons = artwork.isFixed
    ? ""
    : `
      <div class="detail-actions">
        <a href="edit-artwork.html?id=${artwork.id}" class="edit-link">Edit</a>
        <button id="delete-btn" class="delete-btn" data-id="${artwork.id}">Delete</button>
      </div>
    `;

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
        ${actionButtons}
      </div>
    </div>
  `;

  renderDetailNav(artworks, index);
  setupDeleteButton();
}

function renderDetailNav(artworks, index) {
  const navContainer = document.getElementById("detail-nav");
  if (!navContainer) return;

  const total = artworks.length;
  const prev = artworks[(index - 1 + total) % total];
  const next = artworks[(index + 1) % total];
  const counter = `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;

  navContainer.innerHTML = `
    <div class="detail-nav">
      <a href="artwork-detail.html?id=${prev.id}">← Previous</a>
      <span class="counter">${counter}</span>
      <a href="artwork-detail.html?id=${next.id}">Next →</a>
    </div>
  `;
}

function setupDeleteButton() {
  const btn = document.getElementById("delete-btn");
  if (!btn) return;

  btn.addEventListener("click", async () => {
    const confirmed = confirm("Are you sure you want to delete this artwork? This cannot be undone.");
    if (!confirmed) return;

    const id = btn.getAttribute("data-id");

    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(`Server responded with status ${response.status}: ${errorBody.error || "unknown error"}`);
      }

      alert("Artwork deleted.");
      window.location.href = "gallery.html";
    } catch (err) {
      alert("Delete failed. Error details: " + err.message);
    }
  });
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

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const newArtwork = {
      title: document.getElementById("title").value,
      artist: document.getElementById("artist").value,
      image_url: document.getElementById("image_url").value || "https://placehold.co/700x520/EDEBE4/1E1D1A?text=",
      description: document.getElementById("description").value,
      year: "2026",
      medium: "Mixed media"
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newArtwork)
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(`Server responded with status ${response.status}: ${errorBody.error || "unknown error"}`);
      }

      alert("Artwork added to the collection!");
      window.location.href = "gallery.html";
    } catch (err) {
      alert("Add failed. Error details: " + err.message);
    }
  });
}

async function setupEditArtworkForm() {
  const form = document.getElementById("edit-artwork-form");
  if (!form) return;

  setupDropzone();

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  try {
    const response = await fetch(`${API_URL}/${id}`);

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(`Server responded with status ${response.status}: ${errorBody.error || "unknown error"}`);
    }

    const artwork = await response.json();

    document.getElementById("title").value = artwork.title;
    document.getElementById("artist").value = artwork.artist;
    document.getElementById("image_url").value = artwork.image_url;
    document.getElementById("description").value = artwork.description;

    document.getElementById("image_url").dispatchEvent(new Event("input"));
  } catch (err) {
    alert("Could not load this artwork for editing. Error details: " + err.message);
    window.location.href = "gallery.html";
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const updatedArtwork = {
      title: document.getElementById("title").value,
      artist: document.getElementById("artist").value,
      image_url: document.getElementById("image_url").value,
      description: document.getElementById("description").value
    };

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedArtwork)
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(`Server responded with status ${response.status}: ${errorBody.error || "unknown error"}`);
      }

      alert("Artwork updated!");
      window.location.href = `artwork-detail.html?id=${id}`;
    } catch (err) {
      alert("Save failed. Error details: " + err.message);
    }
  });
}

setupHeaderScroll();
renderFeatured();
renderGallery();
renderArtworkDetail();
setupAddArtworkForm();
setupEditArtworkForm();