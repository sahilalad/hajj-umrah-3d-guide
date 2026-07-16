import * as THREE from 'three';
import { material } from './helpers.js';
import { createMarbleTexture } from './textures.js';

let marbleMap = null;

function marbleMaterial(tint = 0xffffff, roughness = 0.48) {
  if (!marbleMap) marbleMap = createMarbleTexture(3);
  return new THREE.MeshStandardMaterial({
    map: marbleMap,
    color: tint,
    roughness,
    metalness: 0.03,
  });
}

/** Multi-ring mataf floor with radial joints and tawaf lane cues. */
export function createMatafFloor(root, radius = 55) {
  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(radius, 160),
    marbleMaterial(0xf4f0e8, 0.5),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  root.add(floor);

  for (let r = 10; r <= radius - 4; r += 4.5) {
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(r - 0.04, r + 0.04, 160),
      new THREE.MeshStandardMaterial({
        color: 0xd9d2c4,
        roughness: 0.65,
        metalness: 0.02,
        side: THREE.DoubleSide,
      }),
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.03;
    root.add(ring);
  }

  for (let i = 0; i < 24; i += 1) {
    const angle = (i / 24) * Math.PI * 2;
    const joint = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 0.025, radius - 8),
      material(0xd5cec0, { roughness: 0.7 }),
    );
    joint.position.set(Math.cos(angle) * (radius * 0.42), 0.035, Math.sin(angle) * (radius * 0.42));
    joint.rotation.y = -angle;
    root.add(joint);
  }

  return floor;
}

/** Surrounding Haram arcade — white columns, arches, upper gallery. */
export function createHaramArcade(root, innerRadius = 38, outerRadius = 48) {
  const group = new THREE.Group();
  root.add(group);
  const stone = marbleMaterial(0xf0ebe1, 0.55);
  const cream = material(0xe9e3d6, { roughness: 0.62 });

  const count = 48;
  for (let i = 0; i < count; i += 1) {
    const angle = (i / count) * Math.PI * 2;
    const x = Math.cos(angle) * innerRadius;
    const z = Math.sin(angle) * innerRadius;

    const column = new THREE.Mesh(
      new THREE.CylinderGeometry(0.55, 0.62, 9.5, 14),
      stone,
    );
    column.position.set(x, 4.75, z);
    column.castShadow = true;
    column.receiveShadow = true;
    group.add(column);

    const capital = new THREE.Mesh(new THREE.CylinderGeometry(0.78, 0.55, 0.45, 14), cream);
    capital.position.set(x, 9.7, z);
    group.add(capital);

    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.78, 0.35, 14), cream);
    base.position.set(x, 0.2, z);
    group.add(base);

    // Arch to next column
    const next = ((i + 1) / count) * Math.PI * 2;
    const mid = (angle + next) / 2;
    const arch = new THREE.Mesh(
      new THREE.TorusGeometry(2.15, 0.28, 10, 24, Math.PI),
      stone,
    );
    arch.position.set(Math.cos(mid) * innerRadius, 8.2, Math.sin(mid) * innerRadius);
    arch.rotation.y = -mid + Math.PI / 2;
    arch.rotation.z = Math.PI;
    group.add(arch);
  }

  // Upper gallery deck
  const deck = new THREE.Mesh(
    new THREE.RingGeometry(innerRadius - 0.8, outerRadius, 96),
    marbleMaterial(0xefe9de, 0.55),
  );
  deck.rotation.x = -Math.PI / 2;
  deck.position.y = 10.1;
  deck.receiveShadow = true;
  group.add(deck);

  // Outer wall mass
  const wall = new THREE.Mesh(
    new THREE.CylinderGeometry(outerRadius, outerRadius + 0.6, 12, 96, 1, true),
    cream,
  );
  wall.position.y = 6;
  wall.receiveShadow = true;
  group.add(wall);

  // Minarets at cardinal-ish points
  for (let i = 0; i < 9; i += 1) {
    const angle = (i / 9) * Math.PI * 2 + 0.2;
    const r = outerRadius + 1.8;
    const x = Math.cos(angle) * r;
    const z = Math.sin(angle) * r;
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 1.15, 22, 16), cream);
    shaft.position.set(x, 11, z);
    shaft.castShadow = true;
    group.add(shaft);
    const balcony = new THREE.Mesh(new THREE.CylinderGeometry(1.45, 1.45, 0.55, 16), stone);
    balcony.position.set(x, 18.5, z);
    group.add(balcony);
    const top = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.95, 4.2, 16), cream);
    top.position.set(x, 21.2, z);
    group.add(top);
    const spire = new THREE.Mesh(new THREE.ConeGeometry(0.55, 2.4, 16), material(0xd8b25a, { metalness: 0.55, roughness: 0.35 }));
    spire.position.set(x, 24.4, z);
    group.add(spire);
  }

  // Abraj Al-Bait style clock tower cue (educational massing)
  const tower = new THREE.Mesh(new THREE.BoxGeometry(7.5, 48, 7.5), material(0xb9b0a0, { roughness: 0.7 }));
  tower.position.set(-42, 24, -40);
  tower.castShadow = true;
  group.add(tower);
  const clock = new THREE.Mesh(new THREE.BoxGeometry(8.4, 6.5, 8.4), material(0x4f6a5c, { roughness: 0.55 }));
  clock.position.set(-42, 50, -40);
  group.add(clock);
  const tip = new THREE.Mesh(new THREE.ConeGeometry(1.2, 8, 12), material(0xd4af37, { metalness: 0.7, roughness: 0.3 }));
  tip.position.set(-42, 57, -40);
  group.add(tip);

  return group;
}

/** White-clad pilgrim figure (simplified ihram body). */
export function createPilgrim(tint = 0xf7f5f0) {
  const group = new THREE.Group();
  group.userData.pilgrim = true;

  const body = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.22, 0.55, 4, 8),
    material(tint, { roughness: 0.85 }),
  );
  body.position.y = 0.85;
  body.castShadow = true;
  group.add(body);

  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.16, 12, 10),
    material(0xd6b799, { roughness: 0.7 }),
  );
  head.position.y = 1.42;
  group.add(head);

  return group;
}
