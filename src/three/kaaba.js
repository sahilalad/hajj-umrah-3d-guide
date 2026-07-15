import * as THREE from 'three';
import { cylinder, makeClickable, material } from './helpers.js';

export function createKaaba(context, position, scale = 1, key = 'kaaba') {
  const group = new THREE.Group();
  group.position.copy(position);
  group.scale.setScalar(scale);

  const cloth = material(0x050505, { roughness: 0.98, metalness: 0 });
  const clothDetail = material(0x111111, { roughness: 0.93, metalness: 0 });
  const gold = material(0xc99b32, { roughness: 0.31, metalness: 0.70 });
  const darkGold = material(0x8c6117, { roughness: 0.43, metalness: 0.58 });
  const silver = material(0xdadad6, { roughness: 0.23, metalness: 0.90 });
  const marble = material(0xe4dfd4, { roughness: 0.80, metalness: 0.02 });

  const body = new THREE.Mesh(new THREE.BoxGeometry(5.52, 6.58, 4.74), cloth);
  body.position.y = 3.29;
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  const roof = new THREE.Mesh(new THREE.BoxGeometry(5.58, 0.13, 4.8), clothDetail);
  roof.position.y = 6.64;
  roof.castShadow = true;
  group.add(roof);

  const skirtFront = new THREE.Mesh(new THREE.BoxGeometry(5.7, 0.24, 0.25), marble);
  skirtFront.position.set(0, 0.12, 2.43);
  group.add(skirtFront);
  const skirtBack = skirtFront.clone();
  skirtBack.position.z = -2.43;
  group.add(skirtBack);

  const skirtSide = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.24, 4.72), marble);
  skirtSide.position.set(2.83, 0.12, 0);
  group.add(skirtSide);
  const skirtSide2 = skirtSide.clone();
  skirtSide2.position.x = -2.83;
  group.add(skirtSide2);

  const beltY = 4.5;
  const beltFront = new THREE.Mesh(new THREE.BoxGeometry(5.5, 0.62, 0.1), gold);
  beltFront.position.set(0, beltY, 2.42);
  group.add(beltFront);
  const beltBack = beltFront.clone();
  beltBack.position.z = -2.42;
  group.add(beltBack);

  const beltSide = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.62, 4.7), gold);
  beltSide.position.set(2.79, beltY, 0);
  group.add(beltSide);
  const beltSide2 = beltSide.clone();
  beltSide2.position.x = -2.79;
  group.add(beltSide2);

  for (let x = -2.18; x <= 2.18; x += 0.54) {
    const foldFront = new THREE.Mesh(new THREE.BoxGeometry(0.032, 3.68, 0.024), clothDetail);
    foldFront.position.set(x, 2.22, 2.39);
    group.add(foldFront);
    const foldBack = foldFront.clone();
    foldBack.position.z = -2.39;
    group.add(foldBack);
  }
  for (let z = -1.88; z <= 1.88; z += 0.54) {
    const foldRight = new THREE.Mesh(new THREE.BoxGeometry(0.024, 3.68, 0.032), clothDetail);
    foldRight.position.set(2.76, 2.22, z);
    group.add(foldRight);
    const foldLeft = foldRight.clone();
    foldLeft.position.x = -2.76;
    group.add(foldLeft);
  }

  for (let x = -2.1; x <= 2.1; x += 0.7) {
    const ornament = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.1, 0.026), darkGold);
    ornament.position.set(x, beltY, 2.49);
    group.add(ornament);
    const ornamentBack = ornament.clone();
    ornamentBack.position.z = -2.49;
    group.add(ornamentBack);
  }

  // Corrected V15 orientation: door on +Z face, Hajar al-Aswad on the left corner.
  const doorX = -1.18;
  const frame = new THREE.Mesh(new THREE.BoxGeometry(1.08, 1.82, 0.17), gold);
  frame.position.set(doorX, 2, 2.47);
  group.add(frame);
  const door = new THREE.Mesh(new THREE.BoxGeometry(0.92, 1.64, 0.21), darkGold);
  door.position.set(doorX, 2, 2.54);
  group.add(door);
  for (let y = 1.48; y <= 2.5; y += 0.34) {
    const line = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.045, 0.026), gold);
    line.position.set(doorX, y, 2.66);
    group.add(line);
  }
  for (let x = doorX - 0.28; x <= doorX + 0.28; x += 0.28) {
    const line = new THREE.Mesh(new THREE.BoxGeometry(0.045, 1.3, 0.026), gold);
    line.position.set(x, 2, 2.66);
    group.add(line);
  }
  const sitara = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.42, 0.12), gold);
  sitara.position.set(doorX, 3.14, 2.5);
  group.add(sitara);

  const silverFrame = new THREE.Mesh(new THREE.TorusGeometry(0.235, 0.067, 14, 40), silver);
  silverFrame.position.set(-2.78, 0.8, 2.39);
  silverFrame.rotation.y = Math.PI / 4;
  group.add(silverFrame);
  const blackStone = new THREE.Mesh(
    new THREE.SphereGeometry(0.175, 24, 16),
    material(0x010101, { roughness: 0.72, metalness: 0 }),
  );
  blackStone.position.set(-2.82, 0.8, 2.44);
  blackStone.scale.set(0.74, 1, 0.3);
  group.add(blackStone);

  // Mizab projects from the +X wall toward Hatim.
  const mizab = new THREE.Mesh(new THREE.CylinderGeometry(0.105, 0.105, 1.3, 18), gold);
  mizab.rotation.z = -Math.PI / 2;
  mizab.position.set(3.18, 6.51, 0);
  group.add(mizab);
  const lip = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.11, 0.28, 18), gold);
  lip.rotation.z = -Math.PI / 2;
  lip.position.set(3.82, 6.51, 0);
  group.add(lip);

  const support = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.4, 0.13), darkGold);
  support.position.set(2.58, 6.34, -0.27);
  group.add(support);
  const support2 = support.clone();
  support2.position.z = 0.27;
  group.add(support2);

  const corners = [
    [2.77, 2.38],
    [-2.77, 2.38],
    [2.77, -2.38],
    [-2.77, -2.38],
  ];
  corners.forEach(([x, z]) => {
    const seam = new THREE.Mesh(new THREE.BoxGeometry(0.1, 6.35, 0.1), clothDetail);
    seam.position.set(x, 3.24, z);
    group.add(seam);
  });

  context.root.add(group);
  makeClickable(context, group, key);
  return group;
}

export function createMaqam(context, position, scale = 1, parent = context.root) {
  const group = new THREE.Group();
  group.position.copy(position);
  group.scale.setScalar(scale);

  const footprint = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.17, 0.34), material(0x8c7551));
  footprint.position.y = 0.42;
  group.add(footprint);

  for (let index = 0; index < 8; index += 1) {
    const angle = index / 8 * Math.PI * 2;
    const pole = cylinder(0.035, 0.045, 1.68, 0xcaa03e, 8, { roughness: 0.35, metalness: 0.62 });
    pole.position.set(Math.cos(angle) * 0.56, 0.92, Math.sin(angle) * 0.56);
    group.add(pole);
  }

  const base = cylinder(0.72, 0.78, 0.2, 0xcaa03e, 8, { roughness: 0.35, metalness: 0.62 });
  base.position.y = 0.1;
  group.add(base);
  const top = cylinder(0.48, 0.67, 0.22, 0xcaa03e, 8, { roughness: 0.35, metalness: 0.62 });
  top.position.y = 1.78;
  group.add(top);

  const glass = new THREE.Mesh(
    new THREE.CylinderGeometry(0.66, 0.66, 1.55, 8),
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.2,
      transmission: 0.82,
      roughness: 0.06,
      depthWrite: false,
    }),
  );
  glass.position.y = 0.95;
  group.add(glass);
  parent.add(group);
  return group;
}

export function createHatim(parent, scale = 1, y = 0.43) {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(3.45 * scale, y, -2.25 * scale),
    new THREE.Vector3(4.65 * scale, y, -3.2 * scale),
    new THREE.Vector3(6.15 * scale, y, -2.65 * scale),
    new THREE.Vector3(6.85 * scale, y, 0),
    new THREE.Vector3(6.15 * scale, y, 2.65 * scale),
    new THREE.Vector3(4.65 * scale, y, 3.2 * scale),
    new THREE.Vector3(3.45 * scale, y, 2.25 * scale),
  ]);
  const wall = new THREE.Mesh(
    new THREE.TubeGeometry(curve, 96, 0.18 * scale, 14, false),
    material(0xeee8dc),
  );
  wall.castShadow = true;
  wall.receiveShadow = true;
  parent.add(wall);

  const shape = new THREE.Shape();
  shape.moveTo(3.7 * scale, -2.05 * scale);
  shape.quadraticCurveTo(6.3 * scale, -3.2 * scale, 6.55 * scale, 0);
  shape.quadraticCurveTo(6.3 * scale, 3.2 * scale, 3.7 * scale, 2.05 * scale);
  shape.lineTo(3.7 * scale, -2.05 * scale);
  const floor = new THREE.Mesh(new THREE.ShapeGeometry(shape), material(0xe9e4d9));
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0.07;
  parent.add(floor);
  return { wall, floor };
}
