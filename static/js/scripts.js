// ======================================================================
// Gestion des événements lors du chargement du DOM
// ======================================================================
document.addEventListener('DOMContentLoaded', () => {
  // Gestion du formulaire de connexion (Tâche 1)
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      // 🌀 Affichage d'un petit loader (optionnel)
      const loginBtn = loginForm.querySelector('button[type="submit"]');
      loginBtn.disabled = true;
      loginBtn.textContent = 'Logging in...';

      await loginUser(email, password);

      loginBtn.disabled = false;
      loginBtn.textContent = 'Login';
    });
  }

  // Vérifie l'authentification et lance le fetch des lieux (Tâche 1 & 2)
  checkAuthentication();

  // Gestion du filtrage dynamique sur la page Index (Tâche 2)
  const priceFilter = document.getElementById('price-filter');
  if (priceFilter) {
    priceFilter.addEventListener('change', () => {
      const selectedPrice = priceFilter.value;
      filterPlacesByPrice(selectedPrice);
    });
  }

  // ======================================================================
  // Code spécifique à la page Place Details (Tâche 3)
  // Se déclenche uniquement si l'élément #place-details existe
  // ======================================================================
  const detailsContainer = document.getElementById('place-details');
  if (detailsContainer) {
    const token = getCookie('token');
    const placeId = getPlaceIdFromURL();
    checkAuthAndFetchPlace(token, placeId);
  }
});

// ======================================================================
// Fonctions pour la connexion et les pages Index / Liste des lieux (Tâches 1 & 2)
// ======================================================================

// Connexion de l'utilisateur et stockage du token en cookie
async function loginUser(email, password) {
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (response.ok) {
      const data = await response.json();
      document.cookie = `token=${data.access_token}; path=/`;

      alert('✅ Login successful');
      window.location.href = 'index.html';
    } else {
      alert('❌ Login failed: ' + response.statusText);
    }
  } catch (error) {
    alert('Erreur réseau: ' + error.message);
  }
}

// Vérifie la présence du token et adapte l'affichage du lien de connexion (pour la page Index)
function checkAuthentication() {
  const token = getCookie('token');
  const loginLink = document.getElementById('login-link');

  if (token) {
    if (loginLink) loginLink.style.display = 'none';
    console.log('✅ Token trouvé :', token);
    fetchPlaces(token);
  } else {
    if (loginLink) loginLink.style.display = 'block';
    console.log('❌ Aucun token trouvé');
  }
}

// Récupère la valeur d'un cookie par son nom
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

// Récupère les lieux via l'API et les affiche (pour la page Index)
async function fetchPlaces(token) {
  try {
    const response = await fetch('http://localhost:5000/places/', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Erreur API: ' + response.statusText);
    const places = await response.json();
    displayPlaces(places);
    window.allPlaces = places;
  } catch (err) {
    console.error('⛔ fetchPlaces error:', err);
  }
}

// Affiche la liste des lieux (page Index)
function displayPlaces(places) {
  const container = document.getElementById('places-list');
  if (!container) return;
  container.innerHTML = '';
  places.forEach(place => {
    const div = document.createElement('div');
    div.className = 'place-card';
    div.innerHTML = `
      <h3>${place.title}</h3>
      <p>${place.description}</p>
      <p>Prix: ${place.price} €</p>
      <a href="place.html?id=${place.id}" class="details-button">View Details</a>
    `;
    container.appendChild(div);
  });
}

// Filtrage local des lieux (page Index)
function filterPlacesByPrice(price) {
  const places = window.allPlaces || [];
  const filtered = places.filter(place => {
    if (price === 'All') return true;
    return place.price <= parseInt(price);
  });
  displayPlaces(filtered);
}

// ======================================================================
// Fonctions spécifiques pour la page Place Details (Tâche 3)
// ======================================================================

// Extrait l'ID du lieu depuis l'URL
function getPlaceIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

// Vérifie l'authentification et lance le fetch des détails d'un lieu
function checkAuthAndFetchPlace(token, placeId) {
  const addReviewSection = document.getElementById('add-review');
  // Si le token existe, afficher le formulaire d'ajout d'avis
  if (token) {
    if (addReviewSection) {
      addReviewSection.style.display = 'block';
    }
    fetchPlaceDetails(token, placeId);
  } else {
    // Sinon, masquer le formulaire d'avis
    if (addReviewSection) {
      addReviewSection.style.display = 'none';
    }
    console.log('❌ Aucun token trouvé, pas de formulaire d\'ajout d\'avis');
  }
}

// Récupère les détails d'un lieu via l'API
async function fetchPlaceDetails(token, placeId) {
  try {
    const response = await fetch(`http://localhost:5000/places/${placeId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Erreur API: ' + response.statusText);
    const place = await response.json();
    displayPlaceDetails(place);
  } catch (err) {
    console.error('⛔ fetchPlaceDetails error:', err);
  }
}

// Injecte dynamiquement les informations du lieu dans la page place.html
function displayPlaceDetails(place) {
  // Mise à jour des éléments HTML par ID
  const titleEl = document.getElementById('place-title');
  const locationEl = document.getElementById('place-location');
  const imageEl = document.getElementById('place-image');
  const hostNameEl = document.getElementById('host-name');
  const hostImageEl = document.getElementById('host-image');
  const priceEl = document.getElementById('place-price');
  const capacityEl = document.getElementById('place-capacity');
  const descriptionEl = document.getElementById('place-description');
  const amenitiesContainer = document.getElementById('place-amenities');
  const reviewsContainer = document.getElementById('reviews-container');
  const addReviewLink = document.getElementById('add-review-link');

  if (titleEl) titleEl.textContent = place.title;
  if (locationEl) locationEl.textContent = place.location || '[Location]';
  if (imageEl) {
    imageEl.src = "/static/images/place2.jpg";
    imageEl.alt = place.title;
  }
  if (hostNameEl) hostNameEl.textContent = place.host_name || '[Host Name]';
  if (hostImageEl) hostImageEl.src = "/static/images/host.jpg";
  if (priceEl) priceEl.textContent = `$${place.price} per night`;
  if (capacityEl) capacityEl.textContent = `${place.guest_capacity || '?'} guests · ${place.bedrooms || '?'} bedrooms · ${place.bathrooms || '?'} bathrooms`;
  if (descriptionEl) descriptionEl.textContent = place.description;

  if (amenitiesContainer) {
    amenitiesContainer.innerHTML = '';
    place.amenities.forEach(am => {
      const li = document.createElement('li');
      li.textContent = am.name || am;
      amenitiesContainer.appendChild(li);
    });
  }

  if (reviewsContainer) {
    reviewsContainer.innerHTML = '';
    if (place.reviews && place.reviews.length > 0) {
      place.reviews.forEach(r => {
        const review = document.createElement('article');
        review.className = 'review-card';
        review.innerHTML = `
          <div class="review-header">
            <img src="/static/images/user1.jpg" alt="${r.user.first_name}" class="user-image">
            <div class="review-meta">
              <h3>${r.user.first_name} ${r.user.last_name}</h3>
              <div class="rating">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
              <p class="review-date">${r.date || 'N/A'}</p>
            </div>
          </div>
          <p class="review-text">${r.text}</p>
        `;
        reviewsContainer.appendChild(review);
      });
    } else {
      reviewsContainer.innerHTML = '<p>No reviews yet.</p>';
    }
  }

  if (addReviewLink) {
    addReviewLink.href = `add_review.html?id=${place.id}`;
  }
}

// ======================================================================
// Tâche 4 - Ajout d’un avis (review) sur une page dédiée
// ======================================================================
document.addEventListener('DOMContentLoaded', () => {
  const reviewForm = document.getElementById('review-form');
  if (reviewForm) {
    const token = checkAuthOrRedirect(); // Redirige si pas auth
    const placeId = getPlaceIdFromURL(); // Récupère place ID de l'URL

    reviewForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const reviewText = document.getElementById('review-text').value.trim();
      const reviewRating = parseInt(document.getElementById('review-rating').value);

      if (!reviewText || isNaN(reviewRating) || reviewRating < 1 || reviewRating > 5) {
        alert("Merci de remplir correctement tous les champs (note de 1 à 5).");
        return;
      }

      try {
        await submitReview(token, placeId, reviewText, reviewRating);
        alert('✅ Votre avis a bien été envoyé !');
        reviewForm.reset();

        // ✅ Rafraîchir les détails du lieu après soumission de la review
        await fetchPlaceDetails(token, placeId);
      } catch (err) {
        console.error('Erreur envoi review:', err);
        alert('❌ Échec de l\'envoi de l\'avis. Veuillez réessayer.');
      }
    });
  }
});

// Redirige si utilisateur non connecté
function checkAuthOrRedirect() {
  const token = getCookie('token');
  if (!token) {
    window.location.href = 'index.html';
  }
  return token;
}

// Soumet la review à l’API
async function submitReview(token, placeId, text, rating) {
  const response = await fetch(`http://localhost:5000/api/reviews/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      text: text,
      rating: rating,
      place_id: parseInt(placeId)
    })
  });

  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.error || 'Erreur API');
  }

  return response.json();
}

// ======================================================================
// Correction du bloc en erreur (récupération du nom du lieu) pour éviter "token is not defined"
// ======================================================================
document.addEventListener('DOMContentLoaded', () => {
  const nameEl = document.querySelector('.place-name');
  const token = getCookie('token');
  const placeId = getPlaceIdFromURL();

  if (nameEl && token && placeId) {
    fetch(`http://localhost:5000/places/${placeId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(place => {
        nameEl.textContent = place.title || '[Unknown Place]';
      })
      .catch(err => {
        console.error('❌ Erreur récupération du nom du lieu:', err);
        nameEl.textContent = '[Erreur de chargement]';
      });
  }
});