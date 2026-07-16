import * as THREE from 'three';
import { addMarker, addRouteTube, makeClickable, material, projectCoordinate, transparentHitMesh } from './helpers.js';
import { createHatim, createKaaba, createMaqam, kaabaLandmarkPositions, KAABA } from './kaaba.js';
import { createHaramArcade, createMatafFloor, createPilgrim } from './haramEnvironment.js';
import { buildTerrain, createArafah, createJamarat, createMina, createMuzdalifah, createSacredCity, createSaiCorridor } from './siteModels.js';

/** Subtle paved corridor between overview landmarks. */
function addSiteLink(context, from, to, width = 1.1) {
  const start = from.clone();
  const end = to.clone();
  const mid = start.clone().lerp(end, 0.5);
  const length = start.distanceTo(end);
  if (length < 0.5) return;
  const road = new THREE.Mesh(
    new THREE.BoxGeometry(width, 0.06, length),
    material(0x8a8478, { roughness: 0.9 }),
  );
  road.position.set(mid.x, 0.12, mid.z);
  road.rotation.y = Math.atan2(end.x - start.x, end.z - start.z);
  road.receiveShadow = true;
  context.root.add(road);
}

export function buildSacredSites(context, data, languageIndex) {
  const haram = projectCoordinate(21.4225, 39.82617);
  const mina = projectCoordinate(21.41527, 39.8778);
  const jamarat = projectCoordinate(21.42139, 39.87278);
  const arafah = projectCoordinate(21.35472, 39.98389);
  const muz = projectCoordinate(21.3893, 39.9127);

  buildTerrain(context, [
    { x: haram.x, z: haram.z, radius: 10 },
    { x: mina.x, z: mina.z, radius: 9 },
    { x: jamarat.x, z: jamarat.z, radius: 8 },
    { x: muz.x, z: muz.z, radius: 9 },
    { x: arafah.x, z: arafah.z, radius: 11 },
  ]);

  createSacredCity(context, haram);
  createMina(context, mina);
  createJamarat(context, jamarat);
  createMuzdalifah(context, muz);
  createArafah(context, arafah);

  // Connect sites in pilgrimage order for a clear professional overview
  addSiteLink(context, haram, jamarat, 1.35);
  addSiteLink(context, jamarat, mina, 1.2);
  addSiteLink(context, mina, muz, 1.25);
  addSiteLink(context, muz, arafah, 1.4);
  addSiteLink(context, arafah, muz, 1.1);

  const route = [
    haram,
    haram.clone().lerp(jamarat, 0.45),
    jamarat,
    mina,
    mina.clone().lerp(muz, 0.5),
    arafah,
    arafah.clone().lerp(muz, 0.55),
    muz,
    mina,
    jamarat,
    haram,
  ].map((point) => point.clone().setY(0.42));
  addRouteTube(context, route);

  [
    ['haram', haram],
    ['jamarat', jamarat],
    ['mina', mina],
    ['muz', muz],
    ['arafah', arafah],
  ].forEach(([key, position]) => addMarker(context, key, position, data[key].n[languageIndex]));

  return { scaleLabel: '2 km' };
}

export function buildHaram(context, data, languageIndex) {
  createMatafFloor(context.root, 58);
  createHaramArcade(context.root, 40, 52);
  createKaaba(context, new THREE.Vector3(0, 0.02, 0), 1, 'kaaba');

  const marks = kaabaLandmarkPositions(1);

  const hajarHit = transparentHitMesh(new THREE.SphereGeometry(0.55, 16, 12), 'blackstone');
  hajarHit.position.copy(marks.blackstoneHit);
  context.root.add(hajarHit);
  context.clickable.push(hajarHit);

  const doorHit = transparentHitMesh(
    new THREE.BoxGeometry(KAABA.doorWidth + 0.3, KAABA.doorHeight + 0.3, 0.2),
    'door',
  );
  doorHit.position.copy(marks.doorHit);
  context.root.add(doorHit);
  context.clickable.push(doorHit);

  const { group: hijrGroup } = createHatim(context.root, 1);
  makeClickable(context, hijrGroup, 'hijr');

  const maqam = createMaqam(context, marks.maqam.clone());
  makeClickable(context, maqam, 'maqam');

  createSaiCorridor(context);
  const saiRoute = [
    new THREE.Vector3(34, 0.4, -22),
    new THREE.Vector3(34, 0.4, 22),
    new THREE.Vector3(34, 0.4, -22),
  ];
  addRouteTube(context, saiRoute, 0x39a878);

  const ruknHit = transparentHitMesh(new THREE.SphereGeometry(0.45, 14, 10), 'rukn');
  ruknHit.position.copy(marks.ruknHit);
  context.root.add(ruknHit);
  context.clickable.push(ruknHit);

  const multazamHit = transparentHitMesh(new THREE.BoxGeometry(1.6, 2.2, 0.15), 'multazam');
  multazamHit.position.copy(marks.multazamHit);
  context.root.add(multazamHit);
  context.clickable.push(multazamHit);

  const mizabHit = transparentHitMesh(new THREE.SphereGeometry(0.4, 14, 10), 'mizab');
  mizabHit.position.copy(marks.mizabHit);
  context.root.add(mizabHit);
  context.clickable.push(mizabHit);

  const labelPositions = [
    ['kaaba', marks.kaaba],
    ['door', marks.door],
    ['blackstone', marks.blackstone],
    ['rukn', marks.rukn],
    ['multazam', marks.multazam],
    ['hijr', marks.hijr],
    ['mizab', marks.mizab],
    ['maqam', marks.maqam],
    ['safa', new THREE.Vector3(34, 0, -23)],
    ['marwah', new THREE.Vector3(34, 0, 23)],
  ];
  labelPositions.forEach(([key, position]) => {
    addMarker(context, key, position, data[key].n[languageIndex]);
  });

  for (let index = 0; index < 46; index += 1) {
    const pilgrim = createPilgrim(index % 5 === 0 ? 0xe8e4da : 0xf7f5f0);
    pilgrim.userData.t = index / 46;
    pilgrim.userData.pilgrim = true;
    context.root.add(pilgrim);
  }

  return { scaleLabel: '1 m ≈ 1 unit' };
}
