// Footer in alle Seiten einfügen
document.addEventListener('DOMContentLoaded', function() {
  const footerContainer = document.getElementById('footer-container');
  if (footerContainer) {
    fetch('footer.html')
      .then(response => response.text())
      .then(data => {
        footerContainer.innerHTML = data;
        const year = footerContainer.querySelector('#footer-year');
        if (year) {
          year.textContent = new Date().getFullYear();
        }
      })
      .catch(error => {
        console.error('Fehler beim Laden des Footers:', error);
      });
  }
});
