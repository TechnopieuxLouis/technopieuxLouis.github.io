// ═══════════════════════════════════════
// CONFIG
// ═══════════════════════════════════════

const BOTTOM_NAV = [
    {id: 'what-is-tmp', label: 'WHAT IS TMP?'},
    {id: 'why-tmp', label: 'WHY CHOOSING TMP?'},
    {id: 'projects', label: 'TYPES OF PROJECTS'},
    {id: 'faq', label: 'FAQ'},
];

const CAROUSEL_PAGES = ['what-is-tmp', 'why-tmp', 'projects', 'faq'];


// ═══════════════════════════════════════
// BOTTOM NAV — auto-generated in each carousel page
// ═══════════════════════════════════════

function createBottomNav(currentPageId) {
    const nav = document.createElement('div');
    nav.className = 'bottom-nav';

    BOTTOM_NAV.forEach(item => {
        const btn = document.createElement('a');
        btn.href = '#';
        btn.className = 'bottom-nav-btn' + (item.id === currentPageId ? ' active' : '');
        btn.dataset.page = item.id;
        btn.textContent = item.label;
        nav.appendChild(btn);
    });

    return nav;
}

CAROUSEL_PAGES.forEach(id => {
    const page = document.getElementById('page-' + id);
    if (page) page.appendChild(createBottomNav(id));
});


// ═══════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════

const pages = document.querySelectorAll('.page, .carousel-page');

function showPage(id) {
    pages.forEach(p => p.classList.remove('active'));

    const target = document.getElementById('page-' + id);
    if (target) target.classList.add('active');

    document.body.classList.toggle('home-active', id === 'home');
    document.body.classList.toggle('contact-active', id === 'contact');

    // Update all bottom-nav active states across all carousel pages
    document.querySelectorAll('.bottom-nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.page === id);
    });

    window.scrollTo(0, 0);
}

// Event delegation — single listener for all data-page clicks
document.addEventListener('click', e => {
    const link = e.target.closest('[data-page]');
    if (!link) return;
    e.preventDefault();
    showPage(link.dataset.page);
});


// ═══════════════════════════════════════
// CAROUSELS
// ═══════════════════════════════════════

document.querySelectorAll('.carousel-page').forEach(page => {
    const track = page.querySelector('.carousel-track');
    const slides = page.querySelectorAll('.carousel-slide');
    const prevBtn = page.querySelector('.carousel-btn.prev');
    const nextBtn = page.querySelector('.carousel-btn.next');
    const progress = page.querySelector('.carousel-progress');
    const container = page.querySelector('.carousel-track-container');
    const total = slides.length;
    let current = 0;

    // Build progress dots
    slides.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = 'progress-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => goTo(i));
        progress.appendChild(dot);
    });

    function goTo(n) {
        current = Math.max(0, Math.min(n, total - 1));

        const style = getComputedStyle(container);
        const paddingLeft = parseFloat(style.paddingLeft);
        const paddingRight = parseFloat(style.paddingRight);
        const slideW = container.offsetWidth - paddingLeft - paddingRight;
        track.style.transform = `translateX(-${current * slideW}px)`;

        progress.querySelectorAll('.progress-dot').forEach((d, i) =>
            d.classList.toggle('active', i === current)
        );

        prevBtn.disabled = current === 0;
        nextBtn.disabled = current === total - 1;
    }

    prevBtn.addEventListener('click', () => goTo(current - 1));
    nextBtn.addEventListener('click', () => goTo(current + 1));

    // Single click handler: peek right = next, peek left = prev
    container.addEventListener('click', e => {
        const rect = container.getBoundingClientRect();
        const relativeX = e.clientX - rect.left;
        if (relativeX > rect.width * 0.85 && current < total - 1) {
            goTo(current + 1);
        } else if (relativeX < rect.width * 0.15 && current > 0) {
            goTo(current - 1);
        }
    });

    // Recalculate on resize
    window.addEventListener('resize', () => goTo(current));

    // Keyboard navigation (only when page is active)
    document.addEventListener('keydown', e => {
        if (!page.classList.contains('active')) return;
        if (e.key === 'ArrowRight') goTo(current + 1);
        if (e.key === 'ArrowLeft') goTo(current - 1);
    });

    // Touch swipe
    let startX = 0;
    track.addEventListener('touchstart', e => {
        startX = e.touches[0].clientX;
    }, {passive: true});
    track.addEventListener('touchend', e => {
        const diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
            diff > 0 ? goTo(current + 1) : goTo(current - 1);
        }
    }, {passive: true});

    goTo(0);
});


// ═══════════════════════════════════════
// DEFAULT PAGE
// ═══════════════════════════════════════

showPage('home');
