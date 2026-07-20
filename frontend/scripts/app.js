const API_URL = `http://${window.location.hostname}:3000/artworks`;
const AUTH_URL = `http://${window.location.hostname}:3000/auth`;

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
    if (!getLoggedInUser()) {
      alert("You must be signed in to delete artwork.");
      window.location.href = "signin.html";
      return;
    }

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

let uploadedImageData = null;

function setupDropzone() {
  const dropzone = document.getElementById("dropzone");
  const fileInput = document.getElementById("image-file");
  const preview = document.getElementById("image-preview");
  const dropzoneText = document.getElementById("dropzone-text");
  if (!dropzone || !fileInput) return;

  function handleFile(file) {
    if (!file || !file.type.startsWith("image/")) {
      alert("Please choose an image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      uploadedImageData = e.target.result;
      preview.src = uploadedImageData;
      preview.style.display = "block";
      dropzoneText.style.display = "none";
      dropzone.querySelector(".browse").style.display = "none";
    };
    reader.readAsDataURL(file);
  }

  dropzone.addEventListener("click", () => fileInput.click());

  fileInput.addEventListener("change", (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  });

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
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  });
}

function setupAddArtworkForm() {
  const form = document.getElementById("add-artwork-form");
  if (!form) return;

  if (!getLoggedInUser()) {
    alert("You must be signed in to add artwork.");
    window.location.href = "signin.html";
    return;
  }

  uploadedImageData = null;
  setupDropzone();

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!uploadedImageData) {
      alert("Please choose an image before submitting.");
      return;
    }

    const newArtwork = {
      title: document.getElementById("title").value,
      artist: document.getElementById("artist").value,
      image_url: uploadedImageData,
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

  if (!getLoggedInUser()) {
    alert("You must be signed in to edit artwork.");
    window.location.href = "signin.html";
    return;
  }

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
    document.getElementById("description").value = artwork.description;

    uploadedImageData = artwork.image_url;
    const preview = document.getElementById("image-preview");
    const dropzoneText = document.getElementById("dropzone-text");
    const browseText = document.querySelector(".dropzone .browse");
    preview.src = uploadedImageData;
    preview.style.display = "block";
    dropzoneText.style.display = "none";
    if (browseText) browseText.style.display = "none";
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
      image_url: uploadedImageData,
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

function getLoggedInUser() {
  const stored = localStorage.getItem("artsysUser");
  return stored ? JSON.parse(stored) : null;
}

function updateAuthNav() {
  const el = document.getElementById("auth-status");
  if (!el) return;

  const user = getLoggedInUser();
  if (user) {
    el.innerHTML = `<span class="auth-username">${user.username}</span> <a href="#" id="logout-link">Log out</a>`;
    document.getElementById("logout-link").addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("artsysUser");
      window.location.href = "index.html";
    });
  } else {
    el.innerHTML = `<a href="signin.html">Sign in</a>`;
  }
}

function setupSignupForm() {
  const form = document.getElementById("signup-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const newUser = {
      username: document.getElementById("username").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value
    };

    try {
      const response = await fetch(`${AUTH_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Signup failed");

      localStorage.setItem("artsysUser", JSON.stringify(data));
      window.location.href = "gallery.html";
    } catch (err) {
      alert("Signup failed: " + err.message);
    }
  });
}

function setupSigninForm() {
  const form = document.getElementById("signin-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const credentials = {
      email: document.getElementById("email").value,
      password: document.getElementById("password").value
    };

    try {
      const response = await fetch(`${AUTH_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Sign in failed");

      localStorage.setItem("artsysUser", JSON.stringify(data));
      window.location.href = "gallery.html";
    } catch (err) {
      alert("Sign in failed: " + err.message);
    }
  });
}

setupHeaderScroll();
updateAuthNav();
renderFeatured();
renderGallery();
renderArtworkDetail();
setupAddArtworkForm();
setupEditArtworkForm();
setupSignupForm();
setupSigninForm();