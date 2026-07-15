function escapeXml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function getCommonsFileName(url) {
  try {
    const parsed = new URL(url, window.location.href);
    const parts = parsed.pathname.split('/').filter(Boolean);
    const thumbIndex = parts.indexOf('thumb');
    if (thumbIndex >= 0 && parts[thumbIndex + 3]) {
      return decodeURIComponent(parts[thumbIndex + 3]);
    }
    const fileIndex = parts.indexOf('file');
    if (parsed.hostname.includes('commons.wikimedia.org') && fileIndex >= 0 && parts[fileIndex + 1]) {
      return decodeURIComponent(parts.slice(fileIndex + 1).join('/'));
    }
  } catch {
    return '';
  }
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
  const text = escapeXml(title);
  const lower = title.toLowerCase();
  let art;

  if (/kaaba|haram|hajar|black stone|rukn|multazam|maqam|hijr|hatim|mizab|door/.test(lower)) {
    art = `
      <ellipse cx="600" cy="590" rx="410" ry="105" fill="#d9d3c6" opacity=".55"/>
      <rect x="390" y="210" width="380" height="360" rx="5" fill="#101413"/>
      <rect x="390" y="294" width="380" height="48" fill="#c59a3d"/>
      <rect x="454" y="395" width="72" height="130" rx="4" fill="#caa04a"/>
      <path d="M770 390 C870 335 990 365 1025 485 C990 530 890 550 805 510" fill="none" stroke="#f1ede4" stroke-width="26" stroke-linecap="round"/>
      <g transform="translate(555 500)"><polygon points="0,45 42,0 84,45 70,110 14,110" fill="#caa04a"/><rect x="18" y="32" width="48" height="62" rx="8" fill="#dfe9e6" opacity=".65"/></g>`;
  } else if (/mina|tent/.test(lower)) {
    art = Array.from({ length: 8 }, (_, index) => {
      const x = 180 + (index % 4) * 230;
      const y = 270 + Math.floor(index / 4) * 210;
      return `<path d="M${x} ${y + 120} L${x + 85} ${y} L${x + 170} ${y + 120} Z" fill="#f2eee3" stroke="#c8b27a" stroke-width="8"/><rect x="${x + 82}" y="${y + 55}" width="6" height="65" fill="#9e8a5e"/>`;
    }).join('');
  } else if (/araf|rahmah|mount/.test(lower)) {
    art = '<path d="M95 610 L330 365 L470 475 L610 245 L760 430 L900 320 L1110 610 Z" fill="#8b7151"/><path d="M555 315 L610 245 L665 330" fill="none" stroke="#efe9da" stroke-width="18"/><rect x="600" y="145" width="20" height="115" fill="#f7f5ef"/><rect x="572" y="135" width="76" height="18" fill="#f7f5ef"/>';
  } else if (/muzdalifah|muz/.test(lower)) {
    art = `<circle cx="920" cy="190" r="78" fill="#f5df91"/><circle cx="955" cy="160" r="78" fill="#0d4a42"/><path d="M80 610 Q330 430 600 560 T1120 520 L1120 700 L80 700 Z" fill="#6f624d"/>${Array.from({ length: 9 }, (_, index) => `<line x1="${150 + index * 110}" y1="350" x2="${150 + index * 110}" y2="590" stroke="#d8d2c5" stroke-width="7"/><circle cx="${150 + index * 110}" cy="346" r="18" fill="#ffd878"/>`).join('')}`;
  } else if (/jamarat|bridge/.test(lower)) {
    art = `<rect x="120" y="300" width="960" height="82" rx="12" fill="#c8cbc8"/><rect x="170" y="430" width="860" height="82" rx="12" fill="#b7bab7"/>${Array.from({ length: 7 }, (_, index) => `<rect x="${190 + index * 135}" y="500" width="34" height="150" fill="#d9dad6"/>`).join('')}<rect x="500" y="205" width="42" height="250" rx="12" fill="#eee9dd"/><rect x="690" y="205" width="42" height="250" rx="12" fill="#eee9dd"/>`;
  } else {
    art = '<path d="M80 610 L300 390 L430 505 L610 300 L760 490 L910 360 L1120 610 Z" fill="#8b7454"/><path d="M210 610 Q600 510 990 610" fill="none" stroke="#d8b25a" stroke-width="20" stroke-linecap="round"/>';
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
      <text x="600" y="690" text-anchor="middle" font-family="Arial, sans-serif" font-size="35" font-weight="700" fill="#ffffff">${text}</text>
      <text x="600" y="728" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" fill="#d8c99c">Photo unavailable — showing a local guide illustration</text>
    </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export class PhotoGallery {
  constructor({ image, credit, dots, previous, next, stage, getTitle }) {
    this.image = image;
    this.credit = credit;
    this.dots = dots;
    this.previousButton = previous;
    this.nextButton = next;
    this.stage = stage;
    this.getTitle = getTitle;
    this.photos = [];
    this.photoIndex = 0;
    this.candidates = [];
    this.candidateIndex = 0;
    this.currentFileName = '';

    this.image.referrerPolicy = 'no-referrer';
    this.image.decoding = 'async';
    this.image.loading = 'eager';
    this.image.addEventListener('error', () => this.tryNextCandidate());
    this.image.addEventListener('load', () => {
      this.stage.classList.remove('photo-loading');
      this.image.style.opacity = '1';
    });
    this.previousButton.addEventListener('click', () => this.previous());
    this.nextButton.addEventListener('click', () => this.next());
  }

  setPhotos(photos) {
    this.photos = photos?.length ? photos : [];
    this.photoIndex = 0;
    this.render();
  }

  previous() {
    if (!this.photos.length) return;
    this.photoIndex = (this.photoIndex - 1 + this.photos.length) % this.photos.length;
    this.render();
  }

  next() {
    if (!this.photos.length) return;
    this.photoIndex = (this.photoIndex + 1) % this.photos.length;
    this.render();
  }

  setCredit(type) {
    if (type === 'local') {
      this.credit.textContent = 'Local guide illustration';
      this.credit.removeAttribute('href');
      this.credit.style.pointerEvents = 'none';
      return;
    }
    this.credit.textContent = type === 'proxy'
      ? 'Photo: Wikimedia Commons (optimized delivery)'
      : 'Photo: Wikimedia Commons';
    this.credit.href = commonsPage(this.currentFileName);
    this.credit.style.pointerEvents = 'auto';
  }

  loadCandidate() {
    const candidate = this.candidates[this.candidateIndex];
    if (!candidate) return;
    this.stage.classList.add('photo-loading');
    this.image.style.opacity = '0.18';
    this.image.alt = candidate.type === 'local'
      ? `Illustration of ${this.getTitle()}`
      : `Photo of ${this.getTitle()}`;
    this.setCredit(candidate.type);
    this.image.src = candidate.src;
  }

  tryNextCandidate() {
    this.candidateIndex += 1;
    if (this.candidateIndex >= this.candidates.length) {
      this.candidates = [{ src: localIllustration(this.getTitle()), type: 'local' }];
      this.candidateIndex = 0;
    }
    this.loadCandidate();
  }

  render() {
    const source = this.photos[this.photoIndex];
    const title = this.getTitle();
    this.currentFileName = source ? getCommonsFileName(source) : '';
    this.candidates = [];

    if (source) {
      const redirect = commonsRedirect(this.currentFileName);
      if (redirect) this.candidates.push({ src: redirect, type: 'commons' });
      this.candidates.push({ src: source, type: 'commons' });
      this.candidates.push({ src: proxyUrl(source), type: 'proxy' });
    }
    this.candidates.push({ src: localIllustration(title), type: 'local' });
    this.candidateIndex = 0;

    this.dots.innerHTML = this.photos.map((_, index) => `<i class="${index === this.photoIndex ? 'active' : ''}"></i>`).join('');
    const navigationDisplay = this.photos.length > 1 ? 'block' : 'none';
    this.previousButton.style.display = navigationDisplay;
    this.nextButton.style.display = navigationDisplay;
    this.loadCandidate();
  }
}
