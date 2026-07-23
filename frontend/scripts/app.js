const API_URL = "https://artsys.onrender.com/artworks";
const AUTH_URL = "https://artsys.onrender.com/auth";
const CURRENCY = "₹";

const sampleArtworks = [
  {
    id: 1,
    title: "Sunset Over Hills",
    artist: "Dev1",
    image_url: "https://wallpaperbat.com/img/19063123-wallpaper-forest-river-sunset-art.jpg",
    description: "A calm evening scene rendered in soft, warm tones — light falling across a quiet ridge line just before dusk.",
    year: "2026",
    medium: "Oil on canvas",
    price: 4500,
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
    price: 3200,
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
    price: 5800,
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
    const withPrices = backendArtworks.map(a => ({
      ...a,
      price: a.price || 2000
    }));
    return [...sampleArtworks, ...withPrices];
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

  const wishlisted = isInWishlist(artwork.id);
  const inCart = isInCart(artwork.id);

  detailContainer.innerHTML = `
    <div class="detail-grid">
      <div class="frame">
        <img src="${artwork.image_url}" alt="${artwork.title}" class="detail-image">
      </div>
      <div class="detail-info">
        <div class="detail-heading-row">
          <p class="artist-name">${artwork.artist}</p>
          <button id="wishlist-heart-btn" class="wishlist-heart-btn ${wishlisted ? "active" : ""}" data-id="${artwork.id}" aria-label="Add to wishlist">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="${wishlisted ? "currentColor" : "none"}" stroke="currentColor" stroke-width="1.6"><path d="M12 20s-7-4.4-9.5-8.5C1 8.5 2.8 5 6.2 5c2 0 3.4 1.2 4.8 3 1.4-1.8 2.8-3 4.8-3 3.4 0 5.2 3.5 3.7 6.5C19 15.6 12 20 12 20z"/></svg>
          </button>
        </div>
        <p class="title">${artwork.title}</p>
        <p class="meta-line">${artwork.medium || "Medium unlisted"} · ${artwork.year || "Year unknown"}</p>
        <p class="price-line">${CURRENCY}${artwork.price.toLocaleString()}</p>
        <button id="add-to-cart-btn" class="add-to-cart-btn" data-id="${artwork.id}">
          ${inCart ? "Added to Cart ✓" : "Add to Cart"}
        </button>
        <hr>
        <p class="description">${artwork.description}</p>
        ${actionButtons}
      </div>
    </div>
  `;

  renderDetailNav(artworks, index);
  setupDeleteButton();
  setupWishlistHeartButton();
  setupAddToCartButton();
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

function setupSearch() {
  const toggleBtn = document.getElementById("search-toggle");
  const searchBar = document.getElementById("search-bar");
  const searchInput = document.getElementById("search-input");
  if (!toggleBtn || !searchBar || !searchInput) return;

  toggleBtn.addEventListener("click", () => {
    searchBar.classList.toggle("hidden");
    if (!searchBar.classList.contains("hidden")) {
      searchInput.focus();
    }
  });

  const grid = document.getElementById("gallery-grid");

  if (grid) {
    searchInput.addEventListener("input", () => {
      filterGalleryGrid(searchInput.value);
    });

    const params = new URLSearchParams(window.location.search);
    const initialQuery = params.get("q");
    if (initialQuery) {
      searchInput.value = initialQuery;
      searchBar.classList.remove("hidden");
      filterGalleryGrid(initialQuery);
    }
  } else {
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const query = searchInput.value.trim();
        window.location.href = query
          ? `gallery.html?q=${encodeURIComponent(query)}`
          : "gallery.html";
      }
    });
  }
}

async function filterGalleryGrid(query) {
  const grid = document.getElementById("gallery-grid");
  if (!grid) return;

  const trimmedQuery = query.trim().toLowerCase();
  const artworks = await getAllArtworks();
  const filtered = trimmedQuery
    ? artworks.filter(a =>
        a.title.toLowerCase().includes(trimmedQuery) ||
        a.artist.toLowerCase().includes(trimmedQuery)
      )
    : artworks;

  grid.innerHTML = "";
  filtered.forEach((art, index) => {
    const card = document.createElement("a");
    card.className = "artwork-card fade-in";
    if (index % 3 === 0) card.classList.add("card-large");
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

  if (filtered.length === 0) {
    grid.innerHTML = `<p style="padding: 40px; text-align: center; color: #999;">No artworks found.</p>`;
  }
}

function setupAccountDropdown() {
  const toggleBtn = document.getElementById("account-toggle");
  const dropdown = document.getElementById("account-dropdown");
  if (!toggleBtn || !dropdown) return;

  function renderDropdown() {
    const user = getLoggedInUser();
    if (user) {
      dropdown.innerHTML = `
        <span class="dropdown-username">${user.username}</span>
        <a href="#" id="dropdown-logout">Log out</a>
      `;
    } else {
      dropdown.innerHTML = `
        <a href="signin.html">Sign in</a>
        <a href="signup.html">Create account</a>
      `;
    }
  }

  toggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    renderDropdown();
    dropdown.classList.toggle("hidden");
  });

  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target) && e.target !== toggleBtn) {
      dropdown.classList.add("hidden");
    }
  });

  dropdown.addEventListener("click", (e) => {
    if (e.target.id === "dropdown-logout") {
      e.preventDefault();
      localStorage.removeItem("artsysUser");
      window.location.href = "index.html";
    }
  });
}

function getWishlist() {
  const stored = localStorage.getItem("artsysWishlist");
  return stored ? JSON.parse(stored) : [];
}

function saveWishlist(list) {
  localStorage.setItem("artsysWishlist", JSON.stringify(list));
  updateWishlistBadge();
}

function isInWishlist(id) {
  return getWishlist().includes(id);
}

function toggleWishlist(id) {
  let list = getWishlist();
  if (list.includes(id)) {
    list = list.filter(itemId => itemId !== id);
  } else {
    list.push(id);
  }
  saveWishlist(list);
  return list.includes(id);
}

function updateWishlistBadge() {
  const badge = document.getElementById("wishlist-count");
  if (!badge) return;
  badge.textContent = getWishlist().length;
}

function setupWishlistHeartButton() {
  const btn = document.getElementById("wishlist-heart-btn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const id = parseInt(btn.getAttribute("data-id"));
    const nowActive = toggleWishlist(id);
    btn.classList.toggle("active", nowActive);
    const svg = btn.querySelector("svg");
    svg.setAttribute("fill", nowActive ? "currentColor" : "none");
  });
}

async function renderWishlistPage() {
  const grid = document.getElementById("wishlist-grid");
  if (!grid) return;

  const wishlistIds = getWishlist();
  const artworks = await getAllArtworks();
  const items = artworks.filter(a => wishlistIds.includes(a.id));

  if (items.length === 0) {
    grid.innerHTML = `<p style="padding: 60px; text-align: center; color: #999;">Your wishlist is empty. Browse the <a href="gallery.html" style="color: var(--burgundy);">gallery</a> to add pieces you love.</p>`;
    return;
  }

  grid.innerHTML = "";
  items.forEach((art, index) => {
    const card = document.createElement("a");
    card.className = "artwork-card fade-in";
    if (index % 3 === 0) card.classList.add("card-large");
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

function getCart() {
  const stored = localStorage.getItem("artsysCart");
  return stored ? JSON.parse(stored) : [];
}

function saveCart(list) {
  localStorage.setItem("artsysCart", JSON.stringify(list));
  updateCartBadge();
}

function isInCart(id) {
  return getCart().includes(id);
}

function addToCartItem(id) {
  let list = getCart();
  if (!list.includes(id)) {
    list.push(id);
    saveCart(list);
  }
  return true;
}

function removeFromCart(id) {
  let list = getCart().filter(itemId => itemId !== id);
  saveCart(list);
}

function updateCartBadge() {
  const badge = document.getElementById("cart-count");
  if (!badge) return;
  badge.textContent = getCart().length;
}

function setupAddToCartButton() {
  const btn = document.getElementById("add-to-cart-btn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const id = parseInt(btn.getAttribute("data-id"));
    addToCartItem(id);
    btn.textContent = "Added to Cart ✓";
    btn.classList.add("in-cart");
  });
}

async function renderCartPage() {
  const container = document.getElementById("cart-items");
  if (!container) return;

  const cartIds = getCart();
  const artworks = await getAllArtworks();
  const items = artworks.filter(a => cartIds.includes(a.id));

  const subtotalEl = document.getElementById("cart-subtotal");

  if (items.length === 0) {
    container.innerHTML = `<p style="padding: 60px; text-align: center; color: #999;">Your cart is empty. Browse the <a href="gallery.html" style="color: var(--burgundy);">gallery</a> to find something you love.</p>`;
    if (subtotalEl) subtotalEl.textContent = `${CURRENCY}0`;
    return;
  }

  let subtotal = 0;
  container.innerHTML = "";

  items.forEach(art => {
    subtotal += art.price;
    const row = document.createElement("div");
    row.className = "cart-row";
    row.innerHTML = `
      <a href="artwork-detail.html?id=${art.id}" class="cart-row-image">
        <img src="${art.image_url}" alt="${art.title}">
      </a>
      <div class="cart-row-info">
        <p class="cart-row-artist">${art.artist}</p>
        <p class="cart-row-title">${art.title}</p>
        <p class="cart-row-price">${CURRENCY}${art.price.toLocaleString()}</p>
      </div>
      <button class="cart-remove-btn" data-id="${art.id}">Remove</button>
    `;
    container.appendChild(row);
  });

  if (subtotalEl) subtotalEl.textContent = `${CURRENCY}${subtotal.toLocaleString()}`;

  container.querySelectorAll(".cart-remove-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.getAttribute("data-id"));
      removeFromCart(id);
      renderCartPage();
    });
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
setupSearch();
setupAccountDropdown();
updateWishlistBadge();
renderWishlistPage();
updateCartBadge();
renderCartPage();