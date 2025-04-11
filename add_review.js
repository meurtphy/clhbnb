// ======================================================================
// Vérifie token et précharge le nom du lieu dans add_review.html
// ======================================================================
document.addEventListener('DOMContentLoaded', () => {
    const nameEl = document.querySelector('.place-name');
    const token = getCookie('token');
    const placeId = getPlaceIdFromURL();

    if (!token) {
      console.warn('🔒 Utilisateur non connecté, redirection...');
      window.location.href = 'login.html';
      return;
    }

    if (nameEl && placeId) {
      fetch(`http://localhost:5000/places/${placeId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => {
          if (!res.ok) throw new Error('Échec API');
          return res.json();
        })
        .then(place => {
          nameEl.textContent = place.title || '[Place Name]';
        })
        .catch(err => {
          console.error('❌ Erreur récupération du lieu:', err);
          nameEl.textContent = '[Erreur de chargement]';
        });
    }
  });
