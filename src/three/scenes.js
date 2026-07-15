import * as THREE from 'three';
import { addMarker, addRouteTube, makeClickable, material, projectCoordinate, sphere, transparentHitMesh } from './helpers.js';
import { createHatim, createKaaba, createMaqam } from './kaaba.js';
import { buildTerrain, createArafah, createJamarat, createMina, createMuzdalifah, createSacredCity, createSaiCorridor } from './siteModels.js';

export function buildSacredSites(context, data, languageIndex) {
  buildTerrain(context);

  const haram = projectCoordinate(21.4225, 39.82617);
  const mina = projectCoordinate(21.41527, 39.8778);
  const jamarat = projectCoordinate(21.42139, 39.87278);
  const arafah = projectCoordinate(21.35472, 39.98389);
  const muz = projectCoordinate(21.3893, 39.9127);

  createSacredCity(context, haram);
  createMina(context, mina);
  createArafah(context, arafah);
  createMuzdalifah(context, muz);
  createJamarat(context, jamarat);

  const route = [
    haram,
    projectCoordinate(21.418, 39.85),
    jamarat,
    mina,
    projectCoordinate(21.393, 39.93),
    arafah,
    projectCoordinate(21.373, 39.953),
    muz,
    mina,
    jamarat,
    haram,
  ].map((point) => point.clone().setY(0.38));
  addRouteTube(context, route);

  [
    ['haram', haram],
    ['jamarat', jamarat],
    ['mina', mina],
    ['muz', muz],
    ['arafah', arafah],
  ].forEach(([key, position]) => addMarker(context, key, position, data[key].n[languageIndex]));

  return { scaleLabel: '5 km' };
}

export function buildHaram(context, data, languageIndex) {
  const marble = new THREE.Mesh(new THREE.CircleGeometry(43, 128), material(0xf1efe9));
  marble.rotation.x = -Math.PI / 2;
  marble.receiveShadow = true;
  context.root.add(marble);

  for (let radius = 8; radius <= 29; radius += 3.5) {
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(radius - 0.035, radius + 0.035, 128),
      new THREE.MeshBasicMaterial({ color: 0xcfc9bb, side: THREE.DoubleSide, transparent: true, opacity: 0.68 }),
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.05;
    context.root.add(ring);
  }

  createKaaba(context, new THREE.Vector3(0, 0.05, 0), 1, 'kaaba');

  const hajarHit = transparentHitMesh(new THREE.SphereGeometry(0.34, 16, 12), 'blackstone');
  hajarHit.position.set(-2.88, 0.8, 2.5);
  context.root.add(hajarHit);
  context.clickable.push(hajarHit);

  const doorHit = transparentHitMesh(new THREE.BoxGeometry(1.1, 1.86, 0.12), 'door');
  doorHit.position.set(-1.18, 2, 2.67);
  context.root.add(doorHit);
  context.clickable.push(doorHit);

  const { wall: hijrWall } = createHatim(context.root, 1, 0.43);
  makeClickable(context, hijrWall, 'hijr');

  const maqam = createMaqam(context, new THREE.Vector3(-1.05, 0, 7.2));
  makeClickable(context, maqam, 'maqam');

  createSaiCorridor(context);
  const saiRoute = [
    new THREE.Vector3(27, 0.38, -19),
    new THREE.Vector3(27, 0.38, 19),
    new THREE.Vector3(27, 0.38, -19),
  ];
  addRouteTube(context, saiRoute, 0x39a878);

  const ruknHit = transparentHitMesh(new THREE.SphereGeometry(0.3, 14, 10), 'rukn');
  ruknHit.position.set(-2.88, 1.1, -2.5);
  context.root.add(ruknHit);
  context.clickable.push(ruknHit);

  const multazamHit = transparentHitMesh(new THREE.BoxGeometry(0.88, 1.75, 0.1), 'multazam');
  multazamHit.position.set(-2.18, 1.72, 2.56);
  context.root.add(multazamHit);
  context.clickable.push(multazamHit);

  const mizabHit = transparentHitMesh(new THREE.SphereGeometry(0.32, 14, 10), 'mizab');
  mizabHit.position.set(3.45, 6.45, 0);
  context.root.add(mizabHit);
  context.clickable.push(mizabHit);

  [
    ['kaaba', new THREE.Vector3(0, 0, 0)],
    ['door', new THREE.Vector3(-1.18, 0, 3.35)],
    ['blackstone', new THREE.Vector3(-3.15, 0, 2.8)],
    ['rukn', new THREE.Vector3(-3.15, 0, -2.8)],
    ['multazam', new THREE.Vector3(-2.15, 0, 3.45)],
    ['hijr', new THREE.Vector3(7.15, 0, 0)],
    ['mizab', new THREE.Vector3(4.25, 0, 0)],
    ['maqam', new THREE.Vector3(-1.05, 0, 7.2)],
    ['safa', new THREE.Vector3(27, 0, -20)],
    ['marwah', new THREE.Vector3(27, 0, 20)],
  ].forEach(([key, position]) => addMarker(context, key, position, data[key].n[languageIndex]));

  for (let index = 0; index < 38; index += 1) {
    const pilgrim = sphere(0.1, 0xffffff);
    pilgrim.userData.t = index / 38;
    pilgrim.userData.pilgrim = true;
    context.root.add(pilgrim);
  }

  return { scaleLabel: '50 m' };
}
