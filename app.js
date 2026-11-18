(() => {
  const sidebar = document.getElementById('sidebar');
  const menuBtn = document.getElementById('menu-btn');
  const searchInput = document.getElementById('toc-search');
  const tocLinks = Array.from(document.querySelectorAll('.toc-link'));
  const sections = Array.from(document.querySelectorAll('section.doc-sec'));

  // Mobile TOC drawer
  if (menuBtn && sidebar) {
    menuBtn.addEventListener('click', () => sidebar.classList.toggle('open'));
    tocLinks.forEach(a => a.addEventListener('click', () => sidebar.classList.remove('open')));
  }

  // Keyboard shortcut '/' for quick search
  document.addEventListener('keydown', e => {
    if (e.key === '/' && document.activeElement !== searchInput && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
      e.preventDefault();
      searchInput?.focus();
    }
    if (e.key === 'Escape') {
      closeLightbox();
      if (document.activeElement === searchInput) {
        searchInput.value = '';
        filterToc('');
        searchInput.blur();
      }
    }
  });

  // Live TOC + Section keyword filter
  function filterToc(q) {
    const term = q.trim().toLowerCase();
    tocLinks.forEach(link => {
      const targetId = link.getAttribute('href')?.slice(1);
      const sec = targetId ? document.getElementById(targetId) : null;
      const match = !term ||
        link.textContent.toLowerCase().includes(term) ||
        (sec && sec.textContent.toLowerCase().includes(term));
      link.classList.toggle('hidden', !match);
    });
  }
  if (searchInput) {
    searchInput.addEventListener('input', e => filterToc(e.target.value));
  }

  // Active Scrollspy
  const setActive = id => {
    tocLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + id));
  };
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(entries => {
      const visible = entries
        .filter(e => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible.length) setActive(visible[0].target.id);
    }, { rootMargin: '-80px 0px -65% 0px', threshold: 0.01 });
    sections.forEach(s => obs.observe(s));
  }

  // Asset table category filter
  const filterBtns = Array.from(document.querySelectorAll('.filter-btn'));
  const assetRows = Array.from(document.querySelectorAll('#asset-table tbody tr'));
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.cat;
      assetRows.forEach(row => {
        row.style.display = (cat === 'all' || row.dataset.cat === cat) ? '' : 'none';
      });
    });
  });

  // Copy code buttons
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const codeEl = btn.closest('.code-box')?.querySelector('pre');
      if (!codeEl) return;
      navigator.clipboard?.writeText(codeEl.textContent.trim()).then(() => {
        const orig = btn.textContent;
        btn.textContent = 'Copied';
        setTimeout(() => { btn.textContent = orig; }, 1400);
      });
    });
  });

  // Screenshot lightbox
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');
  function closeLightbox() {
    if (lb) lb.classList.remove('open');
  }
  document.querySelectorAll('.shot-card img').forEach(img => {
    img.addEventListener('click', () => {
      if (!lb || !lbImg) return;
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lb.classList.add('open');
    });
  });
  if (lb) lb.addEventListener('click', closeLightbox);
})();
