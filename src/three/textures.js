import * as THREE from 'three';

function makeCanvas(width, height, paint) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  paint(ctx, width, height);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

/** Black kiswa silk with subtle weave and gold embroidered band. */
export function createKiswaTexture() {
  return makeCanvas(1024, 1024, (ctx, w, h) => {
    const gradient = ctx.createLinearGradient(0, 0, w, h);
    gradient.addColorStop(0, '#050505');
    gradient.addColorStop(0.45, '#0a0a0a');
    gradient.addColorStop(1, '#030303');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);

    for (let y = 0; y < h; y += 4) {
      ctx.fillStyle = y % 8 === 0 ? 'rgba(255,255,255,0.018)' : 'rgba(0,0,0,0.04)';
      ctx.fillRect(0, y, w, 1);
    }

    // Embroidered hizam band (~2/3 height)
    const bandY = h * 0.28;
    const bandH = h * 0.09;
    const gold = ctx.createLinearGradient(0, bandY, 0, bandY + bandH);
    gold.addColorStop(0, '#6f5214');
    gold.addColorStop(0.5, '#e0bf68');
    gold.addColorStop(1, '#6f5214');
    ctx.fillStyle = gold;
    ctx.fillRect(0, bandY, w, bandH);

    ctx.strokeStyle = 'rgba(255, 220, 140, 0.55)';
    ctx.lineWidth = 3;
    for (let i = 0; i < 3; i += 1) {
      const y = bandY + 10 + i * (bandH / 3.2);
      ctx.beginPath();
      for (let x = 0; x <= w; x += 16) {
        const wave = Math.sin(x * 0.04 + i) * 4;
        if (x === 0) ctx.moveTo(x, y + wave);
        else ctx.lineTo(x, y + wave);
      }
      ctx.stroke();
    }

    // Stylized calligraphy blocks along the belt
    ctx.fillStyle = 'rgba(40, 28, 8, 0.55)';
    ctx.font = 'bold 42px "Noto Naskh Arabic", serif';
    ctx.textAlign = 'center';
    ctx.direction = 'rtl';
    const phrases = ['الله', 'لا إله إلا الله', 'محمد رسول الله', 'الله أكبر'];
    phrases.forEach((text, i) => {
      ctx.fillText(text, (i + 0.5) * (w / phrases.length), bandY + bandH * 0.68);
    });

    // Lower sitara-like embroidery strip
    ctx.fillStyle = 'rgba(201, 155, 50, 0.22)';
    ctx.fillRect(0, h * 0.78, w, h * 0.035);
  });
}

/** Warm Carrara-like marble with soft veining. */
export function createMarbleTexture(seed = 1) {
  return makeCanvas(1024, 1024, (ctx, w, h) => {
    ctx.fillStyle = '#f3efe6';
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < 70; i += 1) {
      const x = ((i * 97 * seed) % w);
      const y = ((i * 53 * seed) % h);
      const radius = 40 + ((i * 17) % 120);
      const vein = ctx.createRadialGradient(x, y, 4, x, y, radius);
      vein.addColorStop(0, 'rgba(190, 185, 175, 0.18)');
      vein.addColorStop(1, 'rgba(190, 185, 175, 0)');
      ctx.fillStyle = vein;
      ctx.fillRect(0, 0, w, h);
    }

    ctx.strokeStyle = 'rgba(160, 150, 135, 0.18)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 18; i += 1) {
      ctx.beginPath();
      let x = (i * 61 * seed) % w;
      let y = 0;
      ctx.moveTo(x, y);
      while (y < h) {
        x += Math.sin((y + i) * 0.03) * 18;
        y += 24;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Tile grid
    ctx.strokeStyle = 'rgba(140, 130, 115, 0.12)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= w; x += 64) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y <= h; y += 64) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
  });
}

/** Gold door panel with engraved frames. */
export function createGoldDoorTexture() {
  return makeCanvas(512, 1024, (ctx, w, h) => {
    const base = ctx.createLinearGradient(0, 0, w, h);
    base.addColorStop(0, '#8a6418');
    base.addColorStop(0.5, '#e8c56a');
    base.addColorStop(1, '#6d4e10');
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = 'rgba(60, 40, 8, 0.55)';
    ctx.lineWidth = 8;
    for (let row = 0; row < 5; row += 1) {
      for (let col = 0; col < 2; col += 1) {
        const x = 36 + col * 230;
        const y = 40 + row * 190;
        ctx.strokeRect(x, y, 200, 160);
        ctx.strokeRect(x + 18, y + 18, 164, 124);
      }
    }

    ctx.fillStyle = 'rgba(40, 28, 8, 0.45)';
    ctx.font = 'bold 54px "Noto Naskh Arabic", serif';
    ctx.textAlign = 'center';
    ctx.direction = 'rtl';
    ctx.fillText('الله', w / 2, h * 0.52);
  });
}

export function createEnvMap() {
  const size = 64;
  const data = new Uint8Array(size * size * 4);
  for (let i = 0; i < size * size; i += 1) {
    const t = i / (size * size);
    data[i * 4] = 180 + t * 40;
    data[i * 4 + 1] = 190 + t * 30;
    data[i * 4 + 2] = 200;
    data[i * 4 + 3] = 255;
  }
  const texture = new THREE.DataTexture(data, size, size);
  texture.needsUpdate = true;
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
