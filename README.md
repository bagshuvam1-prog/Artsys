# Artsys

*A digital art gallery — curated with care.*

Artsys is a full-stack web app for showcasing and cataloguing digital artwork. Visitors can browse a curated gallery, search by title or artist, save pieces to a wishlist, add pieces to a cart, and sign up to catalogue their own work.

**Live site:** [artsys-1.onrender.com](https://artsys-1.onrender.com)
**API:** [artsys.onrender.com](https://artsys.onrender.com)

---

## Features

- 🖼️ **Gallery** — browse a responsive grid of artworks with title, artist, medium, and year
- 🔍 **Search** — live filter by artwork title or artist name
- 👤 **Accounts** — sign up, sign in, and a profile dropdown showing the logged-in user
- ♡ **Wishlist** — save favorite pieces and revisit them anytime
- 🛒 **Cart** — add artworks to a cart with pricing and a running subtotal
- ➕ **Catalogue work** — signed-in users can add, edit, and delete artwork with drag-and-drop image upload
- 📱 **Responsive design** — adapts across desktop and mobile

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, vanilla JavaScript |
| Backend | Node.js, Express |
| Data | JSON file storage |
| Hosting | Render (static site + web service) |

---

## Project Structure

```
Artsys/
├── backend/
│   ├── data/              # artworks.json, users.json
│   ├── routes/            # auth.js, artworks.js
│   ├── server.js
│   └── package.json
└── frontend/
    ├── assets/             # logo and static assets
    ├── scripts/
    │   └── app.js          # all client-side logic
    ├── styles/
    │   └── main.css
    ├── index.html
    ├── gallery.html
    ├── artwork-detail.html
    ├── add-artwork.html
    ├── edit-artwork.html
    ├── wishlist.html
    ├── cart.html
    ├── signin.html
    └── signup.html
```

---

## Running Locally

**1. Start the backend**
```bash
cd backend
npm install
node server.js
```
The API runs at `http://localhost:3000`.

**2. Serve the frontend**
Open `frontend/index.html` with a local server (e.g. VS Code's Live Server extension) rather than opening the file directly, so relative paths and fetch requests work correctly.

**3. Point the frontend at your backend**
In `frontend/scripts/app.js`, update:
```js
const API_URL = "http://localhost:3000/artworks";
const AUTH_URL = "http://localhost:3000/auth";
```

---

## Deployment

The project is deployed on [Render](https://render.com):

- **Backend** — Web Service, root directory `backend`, build command `npm install`, start command `node server.js`
- **Frontend** — Static Site, root directory `frontend`, no build step needed

Pushes to `main` automatically redeploy both services.

---

## Roadmap

- [ ] Persistent database (replace JSON file storage)
- [ ] Real checkout flow
- [ ] Price editing on the "Add work" form
- [ ] Image hosting instead of base64 storage

---

*Curated with care.*
