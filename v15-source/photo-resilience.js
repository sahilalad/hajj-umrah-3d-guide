(() => {
  const img = document.getElementById('photo');
  const credit = document.getElementById('photoCredit');
  const stage = document.querySelector('.photoStage');
  if (!img) return;

  let internalChange = false;
  let candidates = [];
  let candidateIndex = 0;
  let currentOriginal = '';
  let currentFileName = '';

  img.referrerPolicy = 'no-referrer';
  img.decoding = 'async';
  img.loading = 'eager';

  const escapeXml = (value) => String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

  function getTitle() {
    return document.getElementById('placeTitle')?.textContent?.trim() || 'Sacred location';
  }

  function getCommonsFileName(url) {
    try {
      const parsed = new URL(url, location.href);
      const parts = parsed.pathname.split('/').filter(Boolean);
      const thumbIndex = parts.indexOf('thumb');
      if (thumbIndex >= 0 && parts[thumbIndex + 3]) {
        return decodeURIComponent(parts[thumbIndex + 3]);
      }
      const redirectIndex = parts.indexOf('file');
      if (parsed.hostname.includes('commons.wikimedia.org') && redirectIndex >= 0 && parts[redirectIndex + 1]) {
        return decodeURIComponent(parts.slice(redirectIndex + 1).join('/'));
      }
    } catch (_) {}
    return '';
  }

  function commonsRedirect(fileName) {
    if (!fileName) return '';
    return `https://commons.wikimedia.org/wiki/Special:Redirect/file/${encodeURIComponent(fileName)}?width=1200`;
  }

  function commonsPage(fileName) {
    if (!fileName) return 'https://commons.wikimedia.org/';
    return `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(fileName).replace(/%20/g, '_')}`;
  }

  function proxyUrl(original) {
    return `https://images.weserv.nl/?url=${encodeURIComponent(original)}&w=1200&h=760&fit=cover&output=webp&q=82`;
  }

  function localIllustration(title) {
    const t = escapeXml(title);
    const lower = title.toLowerCase();
    let art = '';

    if (/kaaba|haram|hajar|black stone|rukn|multazam|maqam|hijr|hatim|mizab|door/.test(lower)) {
      art = `
        <ellipse cx="600" cy="590" rx="410" ry="105" fill="#d9d3c6" opacity=".55"/>
        <rect x="390" y="210" width="380" height="360" rx="5" fill="#101413"/>
        <rect x="390" y="294" width="380" height="48" fill="#c59a3d"/>
        <rect x="454" y="395" width="72" height="130" rx="4" fill="#caa04a"/>
        <path d="M770 390 C870 335 990 365 1025 485 C990 530 890 550 805 510" fill="none" stroke="#f1ede4" stroke-width="26" stroke-linecap="round"/>
        <g transform="translate(555 500)"><polygon points="0,45 42,0 84,45 70,110 14,110" fill="#caa04a"/><rect x="18" y="32" width="48" height="62" rx="8" fill="#dfe9e6" opacity=".65"/></g>`;
    } else if (/mina|tent/.test(lower)) {
      art = Array.from({ length: 8 }, (_, i) => {
        const x = 180 + (i % 4) * 230;
        const y = 270 + Math.floor(i / 4) * 210;
        return `<path d="M${x} ${y + 120} L${x + 85} ${y} L${x + 170} ${y + 120} Z" fill="#f2eee3" stroke="#c8b27a" stroke-width="8"/><rect x="${x + 82}" y="${y + 55}" width="6" height="65" fill="#9e8a5e"/>`;
      }).join('');
    } else if (/araf|rahmah|mount/.test(lower)) {
      art = `<path d="M95 610 L330 365 L470 475 L610 245 L760 430 L900 320 L1110 610 Z" fill="#8b7151"/><path d="M555 315 L610 245 L665 330" fill="none" stroke="#efe9da" stroke-width="18"/><rect x="600" y="145" width="20" height="115" fill="#f7f5ef"/><rect x="572" y="135" width="76" height="18" fill="#f7f5ef"/>`;
    } else if (/muzdalifah|muz/.test(lower)) {
      art = `<circle cx="920" cy="190" r="78" fill="#f5df91"/><circle cx="955" cy="160" r="78" fill="#0d4a42"/><path d="M80 610 Q330 430 600 560 T1120 520 L1120 700 L80 700 Z" fill="#6f624d"/>${Array.from({ length: 9 }, (_, i) => `<line x1="${150 + i * 110}" y1="350" x2="${150 + i * 110}" y2="590" stroke="#d8d2c5" stroke-width="7"/><circle cx="${150 + i * 110}" cy="346" r="18" fill="#ffd878"/>`).join('')}`;
    } else if (/jamarat|bridge/.test(lower)) {
      art = `<rect x="120" y="300" width="960" height="82" rx="12" fill="#c8cbc8"/><rect x="170" y="430" width="860" height="82" rx="12" fill="#b7bab7"/>${Array.from({ length: 7 }, (_, i) => `<rect x="${190 + i * 135}" y="500" width="34" height="150" fill="#d9dad6"/>`).join('')}<rect x="500" y="205" width="42" height="250" rx="12" fill="#eee9dd"/><rect x="690" y="205" width="42" height="250" rx="12" fill="#eee9dd"/>`;
    } else {
      art = `<path d="M80 610 L300 390 L430 505 L610 300 L760 490 L910 360 L1120 610 Z" fill="#8b7454"/><path d="M210 610 Q600 510 990 610" fill="none" stroke="#d8b25a" stroke-width="20" stroke-linecap="round"/>`;
    }

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="760" viewBox="0 0 1200 760">
        <defs>
          <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#0b5549"/><stop offset="1" stop-color="#062f29"/></linearGradient>
          <pattern id="p" width="34" height="34" patternUnits="userSpaceOnUse"><path d="M17 0 L34 17 L17 34 L0 17 Z" fill="none" stroke="#d8b25a" stroke-opacity=".10"/></pattern>
        </defs>
        <rect width="1200" height="760" fill="url(#bg)"/>
        <rect width="1200" height="760" fill="url(#p)"/>
        ${art}
        <rect x="0" y="640" width="1200" height="120" fill="#041f1b" fill-opacity=".78"/>
        <text x="600" y="690" text-anchor="middle" font-family="Arial, sans-serif" font-size="35" font-weight="700" fill="#ffffff">${t}</text>
        <text x="600" y="728" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" fill="#d8c99c">Photo unavailable — showing a local guide illustration</text>
      </svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }

  function setCredit(type) {
    if (!credit) return;
    if (type === 'local') {
      credit.textContent = 'Local guide illustration';
      credit.removeAttribute('href');
      credit.style.pointerEvents = 'none';
    } else {
      credit.textContent = type === 'proxy' ? 'Photo: Wikimedia Commons (optimized delivery)' : 'Photo: Wikimedia Commons';
      credit.href = commonsPage(currentFileName);
      credit.style.pointerEvents = 'auto';
    }
  }

  function setSource(src) {
    internalChange = true;
    img.src = src;
    requestAnimationFrame(() => { internalChange = false; });
  }

  function loadCandidate() {
    const candidate = candidates[candidateIndex];
    if (!candidate) return;
    stage?.classList.add('photo-loading');
    img.style.opacity = '.18';
    img.alt = candidate.type === 'local' ? `Illustration of ${getTitle()}` : `Photo of ${getTitle()}`;
    setCredit(candidate.type);
    setSource(candidate.src);
  }

  function startChain(original) {
    if (!original || original.startsWith('data:')) return;
    currentOriginal = original;
    currentFileName = getCommonsFileName(original);
    const first = commonsRedirect(currentFileName);
    candidates = [];
    if (first) candidates.push({ src: first, type: 'commons' });
    candidates.push({ src: original, type: 'commons' });
    candidates.push({ src: proxyUrl(original), type: 'proxy' });
    candidates.push({ src: localIllustration(getTitle()), type: 'local' });
    candidateIndex = 0;
    loadCandidate();
  }

  const observer = new MutationObserver(() => {
    if (internalChange) return;
    const assigned = img.getAttribute('src') || '';
    if (!assigned || assigned.startsWith('data:')) return;
    if (assigned === currentOriginal && candidates.length) return;
    startChain(assigned);
  });

  observer.observe(img, { attributes: true, attributeFilter: ['src'] });

  img.addEventListener('error', () => {
    candidateIndex += 1;
    if (candidateIndex >= candidates.length) {
      candidates = [{ src: localIllustration(getTitle()), type: 'local' }];
      candidateIndex = 0;
    }
    loadCandidate();
  }, true);

  img.addEventListener('load', () => {
    stage?.classList.remove('photo-loading');
    img.style.opacity = '1';
  }, true);

  const initial = img.getAttribute('src');
  if (initial) startChain(initial);
})();
