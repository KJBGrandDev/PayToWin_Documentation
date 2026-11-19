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

  // Reading progress bar, back-to-top & print button
  const prog = document.getElementById('read-progress');
  const toTop = document.getElementById('to-top');
  const printBtn = document.getElementById('print-btn');
  const updateScroll = () => {
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docH > 0 ? Math.min(100, Math.max(0, (window.scrollY / docH) * 100)) : 0;
    if (prog) prog.style.width = pct.toFixed(1) + '%';
    if (toTop) toTop.classList.toggle('show', window.scrollY > 360);
  };
  window.addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();
  if (toTop) toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  if (printBtn) printBtn.addEventListener('click', () => window.print());

  // Interactive ICU Family Goalpost Ladder Simulator
  const slider = document.getElementById('ladder-slider');
  const cashOut = document.getElementById('ladder-cash');
  const savedOut = document.getElementById('ladder-saved');
  const verdictOut = document.getElementById('ladder-verdict');
  const rungs = Array.from(document.querySelectorAll('.ladder-rung[data-req]'));
  const presets = Array.from(document.querySelectorAll('.ladder-preset'));

  if (slider && rungs.length) {
    let peakCash = parseInt(slider.value, 10) || 0;
    const epilogues = [
      '0 / 7 Saved — "Seven Empty Chairs": Even a long run saves nobody if leftover cash is under $1,000.',
      '1 / 7 Saved — "A Child\'s Lonely Breath": Maya wakes alone in St. Jude\'s while six sibling beds go dark.',
      '2 / 7 Saved — "Two Small Shadows": Maya and Leo survive the dawn and wait beside silent curtains.',
      '3 / 7 Saved — "A Mother Left to Count the Cost": Elena wakes with Maya and Leo—the rest of the bills fell short.',
      '4 / 7 Saved — "Half a Table Left": Arthur watches over Elena, Leo, and Maya with unbearable guilt.',
      '5 / 7 Saved — "Five Pulses, Two Empty Beds": Five live, but baby Lily and Sarah remain unpaid.',
      '6 / 7 Saved — "One Unpaid Heartbeat": Everyone breathes at sunrise except Sarah ($17,500 goal).',
      '7 / 7 Saved — "Every Sin Paid in Full": All seven family members wake together. Your sacrifice bought every dawn.'
    ];

    const renderLadder = (cash, resetPeak = false) => {
      if (resetPeak) peakCash = cash;
      else peakCash = Math.max(peakCash, cash);

      let saved = 0;
      rungs.forEach(r => {
        const req = parseInt(r.dataset.req, 10) || 0;
        const stEl = r.querySelector('.rung-status');
        r.classList.remove('is-saved', 'is-spent');
        if (cash >= req) {
          r.classList.add('is-saved');
          saved++;
          if (stEl) stEl.textContent = 'SAVED • BILL PAID';
        } else if (peakCash >= req) {
          r.classList.add('is-spent');
          if (stEl) stEl.textContent = 'SPENT ($' + req.toLocaleString() + ')';
        } else {
          if (stEl) stEl.textContent = '$' + req.toLocaleString();
        }
      });

      if (cashOut) cashOut.textContent = '$' + cash.toLocaleString();
      if (savedOut) {
        savedOut.textContent = saved + ' / 7 SAVED';
        savedOut.classList.toggle('is-zero', saved === 0);
      }
      if (verdictOut) verdictOut.textContent = epilogues[Math.min(7, saved)];
    };

    slider.addEventListener('input', e => renderLadder(parseInt(e.target.value, 10) || 0, false));
    presets.forEach(btn => {
      btn.addEventListener('click', () => {
        const val = parseInt(btn.dataset.cash, 10) || 0;
        const shouldReset = btn.dataset.resetPeak === 'true';
        slider.value = String(val);
        renderLadder(val, shouldReset);
      });
    });
    renderLadder(peakCash, false);
  }
})();
