import * as THREE from 'three';
import { addRockCluster, box, cylinder, makeClickable, material, sphere } from './helpers.js';
import { createHatim, createKaaba, createMaqam } from './kaaba.js';

export function buildTerrain(context) {
  const terrain = new THREE.Mesh(
    new THREE.PlaneGeometry(220, 165, 62, 48),
    material(0xb39a6d),
  );
  terrain.rotation.x = -Math.PI / 2;
  const positions = terrain.geometry.attributes.position;
  for (let index = 0; index < positions.count; index += 1) {
    const x = positions.getX(index);
    const y = positions.getY(index);
    const edgeX = Math.max(0, (Math.abs(x) - 76) / 25);
    const edgeY = Math.max(0, (Math.abs(y) - 52) / 18);
    const ridge = (edgeX + edgeY) * 7 + Math.max(0, Math.sin(x * 0.075) + Math.cos(y * 0.09) - 1.15) * 2.3;
    positions.setZ(index, ridge);
  }
  terrain.geometry.computeVertexNormals();
  terrain.receiveShadow = true;
  terrain.userData.terrain = true;
  context.root.add(terrain);

  for (let index = 0; index < 54; index += 1) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 72 + Math.random() * 30;
    const rock = new THREE.Mesh(
      new THREE.DodecahedronGeometry(1.2 + Math.random() * 2.1, 0),
      material(0x806b4d),
    );
    rock.position.set(Math.cos(angle) * radius, 0.55 + Math.random() * 1.1, Math.sin(angle) * radius * 0.72);
    rock.scale.set(1.1 + Math.random(), 0.45 + 0.45 * Math.random(), 1.1 + Math.random());
    rock.userData.terrain = true;
    context.root.add(rock);
  }
}

export function createSacredCity(context, position) {
  const group = new THREE.Group();
  group.position.copy(position);
  context.root.add(group);

  const pad = cylinder(8.8, 8.8, 0.22, 0xece6da, 72);
  pad.position.y = 0.11;
  group.add(pad);
  const mataf = new THREE.Mesh(new THREE.CircleGeometry(6.25, 80), material(0xeee9df));
  mataf.rotation.x = -Math.PI / 2;
  mataf.position.y = 0.24;
  group.add(mataf);

  const local = new THREE.Group();
  group.add(local);
  const originalRoot = context.root;
  context.root = local;
  createKaaba(context, new THREE.Vector3(0, 0.24, 0), 0.5, 'haram');
  context.root = originalRoot;

  const hatim = new THREE.Group();
  hatim.scale.setScalar(0.5);
  hatim.position.y = 0.12;
  group.add(hatim);
  createHatim(hatim, 1, 0.43);

  const maqam = createMaqam(context, new THREE.Vector3(-0.58, 0.24, 3.6), 0.5, group);
  makeClickable(context, maqam, 'haram');

  for (let index = 0; index < 36; index += 1) {
    const angle = index / 36 * Math.PI * 2;
    const radius = 7.15;
    const pier = box(0.42, 1.05 + (index % 4) * 0.1, 0.42, 0xe8e1d2);
    pier.position.set(Math.cos(angle) * radius, pier.geometry.parameters.height / 2 + 0.23, Math.sin(angle) * radius);
    group.add(pier);
  }
  for (let index = 0; index < 6; index += 1) {
    const angle = index / 6 * Math.PI * 2;
    const minaret = cylinder(0.085, 0.145, 2.75, 0xeee6d5, 12);
    minaret.position.set(Math.cos(angle) * 7.85, 1.6, Math.sin(angle) * 7.85);
    group.add(minaret);
    const cap = cylinder(0, 0.19, 0.24, 0xeee6d5, 12);
    cap.position.set(Math.cos(angle) * 7.85, 3.09, Math.sin(angle) * 7.85);
    group.add(cap);
  }

  const tower = box(1.55, 7.2, 1.55, 0xb7ad9b);
  tower.position.set(-6.35, 3.82, -6.15);
  group.add(tower);
  const clock = box(1.72, 1.02, 1.72, 0x657f70);
  clock.position.set(-6.35, 6.95, -6.15);
  group.add(clock);
  const spire = cylinder(0, 0.14, 1.35, 0xcaa03e, 10);
  spire.position.set(-6.35, 8.14, -6.15);
  group.add(spire);
  makeClickable(context, group, 'haram');
}

export function createMina(context, position) {
  const group = new THREE.Group();
  group.position.copy(position);
  group.rotation.y = -0.04;
  context.root.add(group);

  const valley = new THREE.Mesh(new THREE.CapsuleGeometry(6.2, 14, 8, 24), material(0xc8b487));
  valley.rotation.z = Math.PI / 2;
  valley.scale.z = 0.72;
  valley.position.y = 0.06;
  group.add(valley);

  const tentGeometry = new THREE.CylinderGeometry(0, 0.46, 0.82, 10);
  const tents = new THREE.InstancedMesh(tentGeometry, material(0xf5f1e7), 126);
  tents.castShadow = true;
  tents.receiveShadow = true;
  const matrix = new THREE.Matrix4();
  const quaternion = new THREE.Quaternion();
  const scale = new THREE.Vector3(1, 1, 1);
  let count = 0;
  for (let x = -8.7; x <= 8.7; x += 1.15) {
    for (let z = -3.8; z <= 3.8; z += 1.05) {
      if (Math.abs(z) < 0.42 || Math.abs(x) < 0.45) continue;
      matrix.compose(new THREE.Vector3(x, 0.42, z), quaternion, scale);
      tents.setMatrixAt(count, matrix);
      count += 1;
    }
  }
  tents.count = count;
  group.add(tents);

  for (let z = -3.15; z <= 3.15; z += 2.1) {
    const road = box(18.5, 0.07, 0.28, 0x77736b);
    road.position.set(0, 0.13, z);
    group.add(road);
  }
  const spine = box(0.34, 0.07, 8.4, 0x77736b);
  spine.position.set(0, 0.14, 0);
  group.add(spine);

  const mosque = box(4.1, 0.55, 2.1, 0xe8e2d7);
  mosque.position.set(1.8, 0.35, -5);
  group.add(mosque);
  for (let x = -1.45; x <= 1.45; x += 0.72) {
    const dome = cylinder(0, 0.3, 0.28, 0xe8e2d7, 18);
    dome.position.set(1.8 + x, 0.76, -5);
    group.add(dome);
  }
  makeClickable(context, group, 'mina');
}

export function createArafah(context, position) {
  const group = new THREE.Group();
  group.position.copy(position);
  context.root.add(group);

  const plain = new THREE.Mesh(new THREE.CircleGeometry(11.8, 72), material(0xcbb17b));
  plain.rotation.x = -Math.PI / 2;
  plain.position.y = 0.05;
  group.add(plain);
  const boundary = new THREE.Mesh(
    new THREE.RingGeometry(10.9, 11.25, 72),
    new THREE.MeshBasicMaterial({ color: 0xe7c968, transparent: true, opacity: 0.75, side: THREE.DoubleSide }),
  );
  boundary.rotation.x = -Math.PI / 2;
  boundary.position.y = 0.09;
  group.add(boundary);

  const hill = cylinder(1.15, 4.4, 4.25, 0x8b7050, 11);
  hill.position.set(3.1, 2.12, -1.4);
  hill.scale.z = 0.72;
  group.add(hill);
  const pillar = box(0.24, 1.65, 0.24, 0xf2eee5);
  pillar.position.set(3.1, 4.9, -1.4);
  group.add(pillar);

  const mosque = box(7.1, 0.72, 3, 0xe7e1d5);
  mosque.position.set(-4.3, 0.42, 4.8);
  group.add(mosque);
  for (let index = 0; index < 5; index += 1) {
    const dome = cylinder(0, 0.45, 0.38, 0xe7e1d5, 18);
    dome.position.set(-6.4 + index * 1.05, 1.02, 4.8);
    group.add(dome);
  }
  makeClickable(context, group, 'arafah');
}

export function createMuzdalifah(context, position) {
  const group = new THREE.Group();
  group.position.copy(position);
  context.root.add(group);
  const ground = new THREE.Mesh(new THREE.CircleGeometry(7.7, 64), material(0x81745d));
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = 0.04;
  group.add(ground);
  for (let index = 0; index < 12; index += 1) {
    const angle = index / 12 * Math.PI * 2;
    const lamp = cylinder(0.04, 0.05, 2.1, 0xd7d1c5, 8);
    lamp.position.set(Math.cos(angle) * 5.8, 1.05, Math.sin(angle) * 5.8);
    group.add(lamp);
    const light = sphere(0.13, 0xffd875, { roughness: 0.4, emissive: 0x8a5d12, emissiveIntensity: 1.3 });
    light.position.set(Math.cos(angle) * 5.8, 2.18, Math.sin(angle) * 5.8);
    group.add(light);
  }
  makeClickable(context, group, 'muz');
}

export function createJamarat(context, position) {
  const group = new THREE.Group();
  group.position.copy(position);
  group.rotation.y = 0.02;
  context.root.add(group);

  for (let level = 0; level < 4; level += 1) {
    const deck = box(11.8, 0.3, 3.4, 0xb9bbb8);
    deck.position.y = 0.65 + level * 0.92;
    group.add(deck);
  }
  for (let index = 0; index < 5; index += 1) {
    const column = box(0.38, 4.15, 0.5, 0xdadad5);
    column.position.set(-4.6 + index * 2.3, 2.05, 0);
    group.add(column);
  }
  const xs = [-3.65, -0.55, 3.1];
  const lengths = [1.75, 2, 2.45];
  xs.forEach((x, index) => {
    const wall = box(0.28, 1.95, lengths[index], 0xeee9dd);
    wall.position.set(x, 2.1, 0);
    group.add(wall);
  });
  const ramp1 = box(8.2, 0.24, 1.35, 0xb9bbb8);
  ramp1.rotation.z = -0.13;
  ramp1.position.set(-8, 1.06, -0.88);
  group.add(ramp1);
  const ramp2 = ramp1.clone();
  ramp2.rotation.z = 0.13;
  ramp2.position.set(8, 1.06, 0.88);
  group.add(ramp2);
  makeClickable(context, group, 'jamarat');
}

export function createSaiCorridor(context) {
  const corridor = new THREE.Group();
  corridor.position.set(27, 0, 0);
  context.root.add(corridor);

  const floor = box(8.2, 0.16, 42, 0xdedbd2);
  floor.position.y = 0.1;
  corridor.add(floor);
  const roof = box(8.2, 0.16, 42, 0xe8e5dc);
  roof.position.y = 4.2;
  corridor.add(roof);

  for (let z = -20; z <= 20; z += 2.5) {
    [-3.85, 3.85].forEach((x) => {
      const column = cylinder(0.11, 0.14, 4, 0xe8e3d8, 10);
      column.position.set(x, 2, z);
      corridor.add(column);
    });
  }
  [-4.2, 4.2].forEach((z) => {
    const greenZone = box(8, 3.7, 0.16, 0x36b27a);
    greenZone.position.set(0, 2.05, z);
    corridor.add(greenZone);
  });
  for (let x = -2.4; x <= 2.4; x += 1.2) {
    const lane = box(0.045, 0.03, 40, 0xb6b3aa);
    lane.position.set(x, 0.2, 0);
    corridor.add(lane);
  }

  addRockCluster(context, new THREE.Vector3(27, 0, -20), 'safa');
  addRockCluster(context, new THREE.Vector3(27, 0, 20), 'marwah');
}
