// Afficher la popup automatiquement après 30 secondes
window.onload = function () {
    // Créer l'élément popup
    const popup = document.createElement('span');
    popup.className = 'popup';
    popup.innerHTML = '<a href="/pages/qrcode-nsbrc"><img src="/assets/img/pictos/Icône_contactus.png" alt="contactus"/></a>';

    // Ajouter la popup au body
    document.body.appendChild(popup);

    // Afficher la popup après 5 secondes
    setTimeout(function () {
        popup.classList.add('show');
    }, 5000); // 5 secondes
}