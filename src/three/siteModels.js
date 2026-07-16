import * as THREE from 'three';
import { addRockCluster, box, cylinder, makeClickable, material, sphere } from './helpers.js';
import { createHatim, createKaaba, createMaqam } from './kaaba.js';

export function buildTerrain(context, flattenSites = []) {
  const terrain = new THREE.Mesh(
    new THREE.PlaneGeometry(420, 300, 80, 60),
    material(0xb39a6d),
  );
  terrain.rotation.x = -Math.PI / 2;
  const positions = terrain.geometry.attributes.position;
  for (let index = 0; index < positions.count; index += 1) {
    const x = positions.getX(index);
    const y = positions.getY(index);
    // After rotation.x = -PI/2, plane (x,y) maps to world (x, -y) on the ground.
    const worldX = x;
    const worldZ = -y;

    const edgeX = Math.max(0, (Math.abs(x) - 140) / 40);
    const edgeY = Math.max(0, (Math.abs(y) - 95) / 28);
    let ridge = (edgeX + edgeY) * 9 + Math.max(0, Math.sin(x * 0.045) + Math.cos(y * 0.055) - 1.15) * 2.8;

    // Keep landmark pads flat so sites are not buried in terrain waves
    flattenSites.forEach(({ x: sx, z: sz, radius = 8 }) => {
      const dist = Math.hypot(worldX - sx, worldZ - sz);
      if (dist < radius) {
        const t = dist / radius;
        // Smoothstep falloff to surrounding hills
        const blend = t * t * (3 - 2 * t);
        ridge *= blend;
      }
    });

    positions.setZ(index, ridge);
  }
  terrain.geometry.computeVertexNormals();
  terrain.receiveShadow = true;
  terrain.userData.terrain = true;
  context.root.add(terrain);

  for (let index = 0; index < 70; index += 1) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 130 + Math.random() * 55;
    const rx = Math.cos(angle) * radius;
    const rz = Math.sin(angle) * radius * 0.7;
    // Skip rocks that would pierce landmark clearings
    const nearSite = flattenSites.some(
      ({ x: sx, z: sz, radius = 8 }) => Math.hypot(rx - sx, rz - sz) < radius + 4,
    );
    if (nearSite) continue;

    const rock = new THREE.Mesh(
      new THREE.DodecahedronGeometry(1.4 + Math.random() * 2.4, 0),
      material(0x806b4d),
    );
    rock.position.set(rx, 0.55 + Math.random() * 1.1, rz);
    rock.scale.set(1.1 + Math.random(), 0.45 + 0.45 * Math.random(), 1.1 + Math.random());
    rock.userData.terrain = true;
    context.root.add(rock);
  }
}

export function createSacredCity(context, position) {
  const group = new THREE.Group();
  group.position.copy(position);
  context.root.add(group);

  // Compact overview icon — clear footprint so neighbouring sites stay readable
  const pad = cylinder(5.2, 5.2, 0.18, 0xece6da, 64);
  pad.position.y = 0.1;
  group.add(pad);
  const mataf = new THREE.Mesh(new THREE.CircleGeometry(3.6, 64), material(0xeee9df));
  mataf.rotation.x = -Math.PI / 2;
  mataf.position.y = 0.2;
  group.add(mataf);

  const local = new THREE.Group();
  group.add(local);
  const originalRoot = context.root;
  context.root = local;
  createKaaba(context, new THREE.Vector3(0, 0.2, 0), 0.18, 'haram');
  context.root = originalRoot;

  const hatim = new THREE.Group();
  hatim.position.y = 0.1;
  group.add(hatim);
  createHatim(hatim, 0.18);

  const maqam = createMaqam(context, new THREE.Vector3(-0.3, 0.2, 2.1), 0.18, group);
  makeClickable(context, maqam, 'haram');

  for (let index = 0; index < 28; index += 1) {
    const angle = index / 28 * Math.PI * 2;
    const radius = 4.15;
    const pier = box(0.28, 0.85 + (index % 4) * 0.08, 0.28, 0xe8e1d2);
    pier.position.set(Math.cos(angle) * radius, pier.geometry.parameters.height / 2 + 0.18, Math.sin(angle) * radius);
    group.add(pier);
  }
  for (let index = 0; index < 6; index += 1) {
    const angle = index / 6 * Math.PI * 2;
    const minaret = cylinder(0.06, 0.1, 2.1, 0xeee6d5, 12);
    minaret.position.set(Math.cos(angle) * 4.65, 1.25, Math.sin(angle) * 4.65);
    group.add(minaret);
    const cap = cylinder(0, 0.14, 0.2, 0xeee6d5, 12);
    cap.position.set(Math.cos(angle) * 4.65, 2.4, Math.sin(angle) * 4.65);
    group.add(cap);
  }

  const tower = box(1.05, 5.2, 1.05, 0xb7ad9b);
  tower.position.set(-3.9, 2.75, -3.7);
  group.add(tower);
  const clock = box(1.2, 0.75, 1.2, 0x657f70);
  clock.position.set(-3.9, 5.1, -3.7);
  group.add(clock);
  const spire = cylinder(0, 0.1, 1.0, 0xcaa03e, 10);
  spire.position.set(-3.9, 5.95, -3.7);
  group.add(spire);
  makeClickable(context, group, 'haram');
}

/** Classic peaked Mina membrane tent silhouette (gable walls + ridge). */
function createPeakedTentGeometry(width, depth, wallHeight, peakHeight) {
  const hw = width / 2;
  const hd = depth / 2;
  const peakY = wallHeight + peakHeight;
  const positions = [
    // Floor
    -hw, 0, -hd, hw, 0, -hd, hw, 0, hd, -hw, 0, hd,
    // Front wall (opening face at +z)
    -hw, 0, hd, hw, 0, hd, hw, wallHeight, hd, -hw, wallHeight, hd,
    // Back wall
    hw, 0, -hd, -hw, 0, -hd, -hw, wallHeight, -hd, hw, wallHeight, -hd,
    // Left wall
    -hw, 0, -hd, -hw, 0, hd, -hw, wallHeight, hd, -hw, wallHeight, -hd,
    // Right wall
    hw, 0, hd, hw, 0, -hd, hw, wallHeight, -hd, hw, wallHeight, hd,
    // Front gable (peak)
    -hw, wallHeight, hd, hw, wallHeight, hd, 0, peakY, hd,
    // Back gable
    hw, wallHeight, -hd, -hw, wallHeight, -hd, 0, peakY, -hd,
    // Left roof slope
    -hw, wallHeight, -hd, -hw, wallHeight, hd, 0, peakY, hd, 0, peakY, -hd,
    // Right roof slope
    hw, wallHeight, hd, hw, wallHeight, -hd, 0, peakY, -hd, 0, peakY, hd,
  ];

  const indices = [
    0, 1, 2, 0, 2, 3,
    4, 5, 6, 4, 6, 7,
    8, 9, 10, 8, 10, 11,
    12, 13, 14, 12, 14, 15,
    16, 17, 18, 16, 18, 19,
    20, 21, 22,
    23, 24, 25,
    26, 27, 28, 26, 28, 29,
    30, 31, 32, 30, 32, 33,
  ];

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

/** Slightly oversized bright roof cap so the peak reads from distance. */
function createTentRoofCapGeometry(width, depth, wallHeight, peakHeight) {
  const hw = width / 2 + 0.02;
  const hd = depth / 2 + 0.02;
  const peakY = wallHeight + peakHeight + 0.02;
  const y = wallHeight - 0.01;
  const positions = [
    -hw, y, -hd, -hw, y, hd, 0, peakY, hd, 0, peakY, -hd,
    hw, y, hd, hw, y, -hd, 0, peakY, -hd, 0, peakY, hd,
  ];
  const indices = [0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7];
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

export function createMina(context, position) {
  const group = new THREE.Group();
  group.position.copy(position);
  // Valley runs roughly east–west; western end faces toward Jamarat
  group.rotation.y = -0.08;
  context.root.add(group);

  // Valley floor (camps east/centre; west kept clear toward Jamarat)
  const valley = new THREE.Mesh(
    new THREE.BoxGeometry(14, 0.18, 8.2),
    material(0xc4b189, { roughness: 0.92 }),
  );
  valley.position.set(0.8, 0.05, 0);
  valley.receiveShadow = true;
  group.add(valley);

  // Side hills of the Mina valley
  [-1, 1].forEach((side) => {
    const ridge = new THREE.Mesh(
      new THREE.BoxGeometry(14, 1.6, 2.0),
      material(0x9a8560, { roughness: 0.95 }),
    );
    ridge.position.set(0.8, 0.65, side * 4.7);
    ridge.userData.terrain = true;
    group.add(ridge);
    for (let i = 0; i < 5; i += 1) {
      const bump = new THREE.Mesh(
        new THREE.DodecahedronGeometry(0.45 + (i % 3) * 0.12, 0),
        material(0x8a7454),
      );
      bump.position.set(-5 + i * 2.6, 1.2, side * 4.8);
      bump.scale.set(1.3, 0.65, 1.05);
      bump.userData.terrain = true;
      group.add(bump);
    }
  });

  // Mina tent city — peaked white membrane tents (not flat boxes)
  const fabricMat = material(0xf8f5ee, {
    roughness: 0.62,
    metalness: 0.02,
    side: THREE.DoubleSide,
  });
  const roofMat = material(0xffffff, {
    roughness: 0.55,
    metalness: 0.04,
    emissive: 0xf2eee4,
    emissiveIntensity: 0.12,
    side: THREE.DoubleSide,
  });
  const doorMat = material(0x3d4a45, { roughness: 0.9 });
  const accentColors = [0xd8b25a, 0x4d8f78, 0x6b8cae];

  const tentW = 0.72;
  const tentD = 0.58;
  const wallH = 0.28;
  const peakH = 0.34;
  const tentGeo = createPeakedTentGeometry(tentW, tentD, wallH, peakH);
  const roofGeo = createTentRoofCapGeometry(tentW, tentD, wallH, peakH);
  const doorGeo = new THREE.BoxGeometry(0.16, 0.2, 0.04);

  const maxTents = 160;
  const tents = new THREE.InstancedMesh(tentGeo, fabricMat, maxTents);
  const roofs = new THREE.InstancedMesh(roofGeo, roofMat, maxTents);
  const doors = new THREE.InstancedMesh(doorGeo, doorMat, maxTents);
  tents.castShadow = true;
  tents.receiveShadow = true;
  roofs.castShadow = true;
  doors.castShadow = true;

  const matrix = new THREE.Matrix4();
  const quat = new THREE.Quaternion();
  const scale = new THREE.Vector3(1, 1, 1);
  let tentCount = 0;

  // Camp blocks stay east of the western approach (Jamarat sits further west)
  const blocks = [
    { x0: -4.6, x1: -0.2, z0: -3.1, z1: -1.0, accent: 0 },
    { x0: -4.6, x1: -0.2, z0: 1.0, z1: 3.1, accent: 1 },
    { x0: 0.6, x1: 4.8, z0: -3.1, z1: -1.0, accent: 1 },
    { x0: 0.6, x1: 4.8, z0: 1.0, z1: 3.1, accent: 2 },
    { x0: 5.5, x1: 8.0, z0: -3.1, z1: -1.0, accent: 2 },
    { x0: 5.5, x1: 8.0, z0: 1.0, z1: 3.1, accent: 0 },
  ];

  blocks.forEach((block) => {
    const strip = box(block.x1 - block.x0 + 0.15, 0.04, 0.1, accentColors[block.accent]);
    strip.position.set((block.x0 + block.x1) / 2, 0.16, block.z0 - 0.3);
    group.add(strip);

    for (let x = block.x0; x <= block.x1 - tentW; x += tentW + 0.12) {
      for (let z = block.z0; z <= block.z1 - tentD; z += tentD + 0.1) {
        if (tentCount >= maxTents) break;
        const cx = x + tentW / 2;
        const cz = z + tentD / 2;
        const y = 0.14;
        // Alternate facing toward the central road for readable tent fronts
        const faceRoad = cz < 0 ? 0 : Math.PI;
        quat.setFromAxisAngle(new THREE.Vector3(0, 1, 0), faceRoad);
        matrix.compose(new THREE.Vector3(cx, y, cz), quat, scale);
        tents.setMatrixAt(tentCount, matrix);
        roofs.setMatrixAt(tentCount, matrix);
        // Door on the front gable face
        const doorOffset = new THREE.Vector3(0, wallH * 0.45, tentD / 2 - 0.01);
        doorOffset.applyQuaternion(quat);
        matrix.compose(new THREE.Vector3(cx + doorOffset.x, y + doorOffset.y, cz + doorOffset.z), quat, scale);
        doors.setMatrixAt(tentCount, matrix);
        tentCount += 1;
      }
    }
  });

  tents.count = tentCount;
  roofs.count = tentCount;
  doors.count = tentCount;
  tents.instanceMatrix.needsUpdate = true;
  roofs.instanceMatrix.needsUpdate = true;
  doors.instanceMatrix.needsUpdate = true;
  group.add(tents, roofs, doors);

  // Corner poles on a few edge tents so the camp reads as fabric structures
  for (let i = 0; i < 18; i += 1) {
    const px = -4.2 + (i % 6) * 2.1;
    const pz = (i < 9 ? -1 : 1) * (2.2 + (i % 3) * 0.35);
    const pole = cylinder(0.018, 0.022, wallH + peakH + 0.12, 0xd9d4c8, 6);
    pole.position.set(px, 0.14 + (wallH + peakH + 0.12) / 2, pz);
    group.add(pole);
  }

  // Main roads: central spine + cross streets
  const asphalt = material(0x6a6760, { roughness: 0.88 });
  const spine = new THREE.Mesh(new THREE.BoxGeometry(14.5, 0.08, 0.9), asphalt);
  spine.position.set(0.6, 0.14, 0);
  group.add(spine);
  [-1.8, 2.4].forEach((x) => {
    const cross = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.08, 7.0), asphalt);
    cross.position.set(x, 0.14, 0);
    group.add(cross);
  });
  for (let x = -5; x <= 7; x += 1.3) {
    const dash = box(0.45, 0.02, 0.07, 0xe7e0cf);
    dash.position.set(x, 0.19, 0);
    group.add(dash);
  }

  for (let x = -4; x <= 6; x += 2.2) {
    [-0.48, 0.48].forEach((z) => {
      const pole = cylinder(0.035, 0.045, 1.35, 0xd9d4c8, 8);
      pole.position.set(x, 0.82, z);
      group.add(pole);
      const lamp = sphere(0.09, 0xffe08a, { emissive: 0x8a5d12, emissiveIntensity: 0.9, roughness: 0.4 });
      lamp.position.set(x, 1.5, z);
      group.add(lamp);
    });
  }

  // Masjid al-Khayf
  const mosque = new THREE.Group();
  mosque.position.set(2.4, 0, -3.9);
  group.add(mosque);
  const hall = box(4.4, 0.62, 2.0, 0xf0ebe1);
  hall.position.y = 0.4;
  mosque.add(hall);
  const courtyard = box(4.4, 0.08, 1.15, 0xe4dfd4);
  courtyard.position.set(0, 0.16, 1.45);
  mosque.add(courtyard);
  for (let i = -2; i <= 2; i += 1) {
    const dome = cylinder(0, 0.32, 0.28, 0xf5f1e8, 16);
    dome.position.set(i * 0.8, 0.85, 0);
    mosque.add(dome);
  }
  const minaret = cylinder(0.1, 0.15, 2.1, 0xf0ebe1, 12);
  minaret.position.set(-2.3, 1.2, -0.55);
  mosque.add(minaret);
  const cap = cylinder(0, 0.18, 0.24, 0xd8b25a, 12);
  cap.position.set(-2.3, 2.35, -0.55);
  mosque.add(cap);

  // Western approach road toward Jamarat (gap between camps and bridge)
  const approach = box(3.6, 0.1, 1.6, 0x7a776f);
  approach.position.set(-7.4, 0.14, 0);
  group.add(approach);

  // Compact overview footprint so Mina sits clearly beside Jamarat
  group.scale.setScalar(0.58);
  makeClickable(context, group, 'mina');
}

export function createArafah(context, position) {
  const group = new THREE.Group();
  group.position.copy(position);
  context.root.add(group);

  const plain = new THREE.Mesh(new THREE.CircleGeometry(7.2, 72), material(0xcbb17b));
  plain.rotation.x = -Math.PI / 2;
  plain.position.y = 0.05;
  group.add(plain);
  const boundary = new THREE.Mesh(
    new THREE.RingGeometry(6.6, 6.9, 72),
    new THREE.MeshBasicMaterial({ color: 0xe7c968, transparent: true, opacity: 0.75, side: THREE.DoubleSide }),
  );
  boundary.rotation.x = -Math.PI / 2;
  boundary.position.y = 0.09;
  group.add(boundary);

  const hill = cylinder(0.75, 2.8, 2.8, 0x8b7050, 11);
  hill.position.set(2.0, 1.4, -0.9);
  hill.scale.z = 0.72;
  group.add(hill);
  const pillar = box(0.18, 1.15, 0.18, 0xf2eee5);
  pillar.position.set(2.0, 3.25, -0.9);
  group.add(pillar);

  const mosque = box(4.4, 0.55, 1.9, 0xe7e1d5);
  mosque.position.set(-2.7, 0.35, 3.0);
  group.add(mosque);
  for (let index = 0; index < 5; index += 1) {
    const dome = cylinder(0, 0.3, 0.28, 0xe7e1d5, 18);
    dome.position.set(-4.0 + index * 0.7, 0.82, 3.0);
    group.add(dome);
  }
  makeClickable(context, group, 'arafah');
}

export function createMuzdalifah(context, position) {
  const group = new THREE.Group();
  group.position.copy(position);
  group.position.y = 0.08;
  context.root.add(group);

  // Raised plateau so the site sits clearly above the desert floor
  const plateau = new THREE.Mesh(
    new THREE.CylinderGeometry(5.1, 5.4, 0.35, 48),
    material(0x8a7d66, { roughness: 0.92 }),
  );
  plateau.position.y = 0.12;
  plateau.receiveShadow = true;
  plateau.castShadow = true;
  group.add(plateau);

  const ground = new THREE.Mesh(new THREE.CircleGeometry(4.6, 56), material(0x81745d, { roughness: 0.88 }));
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = 0.31;
  ground.receiveShadow = true;
  group.add(ground);

  for (let index = 0; index < 10; index += 1) {
    const angle = index / 10 * Math.PI * 2;
    const lamp = cylinder(0.035, 0.045, 1.6, 0xd7d1c5, 8);
    lamp.position.set(Math.cos(angle) * 3.4, 1.1, Math.sin(angle) * 3.4);
    group.add(lamp);
    const light = sphere(0.1, 0xffd875, { roughness: 0.4, emissive: 0x8a5d12, emissiveIntensity: 1.3 });
    light.position.set(Math.cos(angle) * 3.4, 1.95, Math.sin(angle) * 3.4);
    group.add(light);
  }

  const pad = box(2.4, 0.08, 1.4, 0x6f6554);
  pad.position.set(0, 0.36, 0);
  group.add(pad);
  makeClickable(context, group, 'muz');
}

export function createJamarat(context, position) {
  const group = new THREE.Group();
  group.position.copy(position);
  // Bridge axis roughly along valley (X); pilgrims approach from Mina (+X in local after rotation)
  group.rotation.y = 0.05;
  context.root.add(group);

  const concrete = material(0xc5c7c3, { roughness: 0.82, metalness: 0.05 });
  const deckMat = material(0xb8bab6, { roughness: 0.78 });
  const railMat = material(0xd8d9d5, { roughness: 0.7 });
  const wallMat = material(0xf2eee6, { roughness: 0.55 });

  const levels = 5;
  const levelH = 0.95;
  const deckLength = 8.8;
  const deckWidth = 4.0;
  const baseY = 0.3;

  // Ground plaza / basin floor
  const plaza = new THREE.Mesh(
    new THREE.BoxGeometry(deckLength + 2.4, 0.14, deckWidth + 2.4),
    material(0x9a968c, { roughness: 0.9 }),
  );
  plaza.position.y = 0.05;
  plaza.receiveShadow = true;
  group.add(plaza);

  // Multi-level decks
  for (let level = 0; level < levels; level += 1) {
    const y = baseY + level * levelH;
    const deck = new THREE.Mesh(
      new THREE.BoxGeometry(deckLength, 0.22, deckWidth - level * 0.08),
      deckMat,
    );
    deck.position.y = y;
    deck.castShadow = true;
    deck.receiveShadow = true;
    group.add(deck);

    // Side barriers
    [-1, 1].forEach((side) => {
      const rail = new THREE.Mesh(
        new THREE.BoxGeometry(deckLength - 0.4, 0.42, 0.12),
        railMat,
      );
      rail.position.set(0, y + 0.32, side * ((deckWidth - level * 0.08) / 2 - 0.08));
      group.add(rail);
    });

    // Support columns under each deck (except ground-linked)
    if (level > 0) {
      for (let i = -2; i <= 2; i += 1) {
        [-1.25, 1.25].forEach((z) => {
          const col = new THREE.Mesh(
            new THREE.BoxGeometry(0.28, levelH - 0.05, 0.35),
            concrete,
          );
          col.position.set(i * 1.7, y - levelH / 2 + 0.05, z);
          col.castShadow = true;
          group.add(col);
        });
      }
    }
  }

  // Three elliptical Jamarat walls (Sughra, Wusta, Kubra) — modern oval basins
  // Spacing compressed for overview scale; sizes increase toward Aqabah (Kubra)
  const jamrah = [
    { x: -2.6, len: 1.35, label: 'sughra' },
    { x: -0.15, len: 1.7, label: 'wusta' },
    { x: 2.5, len: 2.1, label: 'kubra' },
  ];

  jamrah.forEach((j) => {
    const basin = new THREE.Group();
    basin.position.set(j.x, 0, 0);
    group.add(basin);

    // Oval throwing wall through all levels
    const wallH = baseY + (levels - 1) * levelH + 1.35;
    const ellipse = new THREE.Mesh(
      new THREE.CylinderGeometry(0.55, 0.65, wallH, 28),
      wallMat,
    );
    ellipse.scale.set(j.len / 1.4, 1, 1);
    ellipse.position.y = wallH / 2;
    ellipse.castShadow = true;
    basin.add(ellipse);

    // Soften into elongated oval with flanking caps
    [-1, 1].forEach((side) => {
      const cap = new THREE.Mesh(
        new THREE.CylinderGeometry(0.5, 0.58, wallH * 0.98, 16),
        wallMat,
      );
      cap.position.set(side * (j.len * 0.38), wallH / 2, 0);
      basin.add(cap);
    });

    // Ground basin ring
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(j.len * 0.55, 0.12, 10, 36),
      material(0xe8e4da, { roughness: 0.6 }),
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.2;
    ring.scale.set(1, 0.55, 1);
    basin.add(ring);

    // Gold band cue on upper wall
    const band = new THREE.Mesh(
      new THREE.CylinderGeometry(0.68, 0.68, 0.18, 28),
      material(0xd8b25a, { metalness: 0.55, roughness: 0.35 }),
    );
    band.scale.set(j.len / 1.4, 1, 1);
    band.position.y = wallH * 0.72;
    basin.add(band);
  });

  // Approach ramps at both ends (multi-level fan)
  [-1, 1].forEach((dir) => {
    for (let level = 0; level < 3; level += 1) {
      const ramp = new THREE.Mesh(
        new THREE.BoxGeometry(2.8, 0.16, 1.2 - level * 0.12),
        deckMat,
      );
      const y = baseY + level * levelH;
      ramp.position.set(dir * (deckLength / 2 + 1.1), y + 0.16, (level - 1) * 0.7);
      ramp.rotation.z = dir * -0.2;
      ramp.castShadow = true;
      group.add(ramp);
    }
    const tower = box(1.1, levels * levelH + 0.5, 1.3, 0xc9cbc7);
    tower.position.set(dir * (deckLength / 2 + 0.15), (levels * levelH) / 2 + 0.15, dir * 1.9);
    group.add(tower);
  });

  const topY = baseY + (levels - 1) * levelH + 0.3;
  for (let i = -2; i <= 2; i += 1) {
    const post = cylinder(0.05, 0.06, 1.5, 0xd0d2cd, 8);
    post.position.set(i * 1.7, topY + 0.75, 0);
    group.add(post);
    const canopy = box(1.5, 0.05, 2.8, 0xe8e6df);
    canopy.position.set(i * 1.7, topY + 1.45, 0);
    group.add(canopy);
  }

  group.scale.setScalar(0.65);
  makeClickable(context, group, 'jamarat');
}

export function createSaiCorridor(context) {
  const corridor = new THREE.Group();
  corridor.position.set(34, 0, 0);
  context.root.add(corridor);

  // Open-air Sa‘i path — no roof / sealed enclosure
  const floor = box(9.2, 0.18, 48, 0xdedbd2);
  floor.position.y = 0.1;
  corridor.add(floor);

  for (let x = -2.6; x <= 2.6; x += 1.3) {
    const lane = box(0.05, 0.03, 46, 0xb6b3aa);
    lane.position.set(x, 0.22, 0);
    corridor.add(lane);
  }

  // Green-light running zones as floor bands (not walls)
  [-5.2, 5.2].forEach((z) => {
    const greenZone = box(8.6, 0.04, 3.2, 0x36b27a);
    greenZone.position.set(0, 0.2, z);
    corridor.add(greenZone);
  });

  // Low edge kerbs only — path stays open to the sky
  [-4.55, 4.55].forEach((x) => {
    const kerb = box(0.22, 0.28, 46, 0xe4dfd4);
    kerb.position.set(x, 0.22, 0);
    corridor.add(kerb);
  });

  addRockCluster(context, new THREE.Vector3(34, 0, -23), 'safa');
  addRockCluster(context, new THREE.Vector3(34, 0, 23), 'marwah');
}
