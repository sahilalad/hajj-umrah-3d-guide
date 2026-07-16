import * as THREE from 'three';
import { cylinder, makeClickable, material } from './helpers.js';
import {
  createEnvMap,
  createGoldDoorTexture,
  createKiswaTexture,
  createMarbleTexture,
} from './textures.js';

/** Published approximate exterior dimensions (metres). 1 scene unit = 1 m. */
export const KAABA = {
  widthX: 12.86,
  depthZ: 11.03,
  height: 13.1,
  doorWidth: 1.9,
  doorHeight: 3.1,
  doorBottom: 2.13,
  doorOffsetX: -1.65,
  blackStoneHeight: 1.5,
  hizamCenterY: 8.55,
  hizamHeight: 0.95,
  mizabLength: 1.95,
  hatimHeight: 1.31,
  hatimThickness: 0.9,
  /** Inner face depth from Kaaba NW (+X) wall to Hateem inner face (approx.). */
  hatimDepth: 4.25,
  /** Chord between the two Hateem openings (approx.). */
  hatimOpening: 8.0,
  /** Gap from Kaaba corner / shadharwan to each Hateem end. */
  hatimEndGap: 2.25,
};

const shared = {
  kiswa: null,
  marble: null,
  door: null,
  env: null,
};

function textures() {
  if (!shared.kiswa) {
    shared.kiswa = createKiswaTexture();
    shared.marble = createMarbleTexture(2);
    shared.door = createGoldDoorTexture();
    shared.env = createEnvMap();
  }
  return shared;
}

function goldMaterial(roughness = 0.28, metalness = 0.85) {
  const { env } = textures();
  return new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    roughness,
    metalness,
    envMap: env,
    envMapIntensity: 0.85,
  });
}

/**
 * Orientation (educational V15):
 * - Door face: +Z
 * - Hajar al-Aswad: left corner of door face (−X, +Z)
 * - Rukn al-Yamani: (−X, −Z)
 * - Hijr Ismail / Mizab: +X side
 */
export function createKaaba(context, position, scale = 1, key = 'kaaba') {
  const group = new THREE.Group();
  group.position.copy(position);
  group.scale.setScalar(scale);
  group.userData.kaaba = true;

  const { widthX: W, depthZ: D, height: H } = KAABA;
  const hx = W / 2;
  const hz = D / 2;
  const maps = textures();

  const cloth = new THREE.MeshStandardMaterial({
    map: maps.kiswa,
    color: 0xffffff,
    roughness: 0.92,
    metalness: 0.02,
  });
  const clothDetail = material(0x0c0c0c, { roughness: 0.9, metalness: 0 });
  const gold = goldMaterial();
  const darkGold = goldMaterial(0.4, 0.72);
  darkGold.color = new THREE.Color(0x8c6117);
  const silver = new THREE.MeshStandardMaterial({
    color: 0xe8e8e4,
    roughness: 0.22,
    metalness: 0.92,
    envMap: maps.env,
    envMapIntensity: 1,
  });
  const marble = new THREE.MeshStandardMaterial({
    map: maps.marble,
    color: 0xffffff,
    roughness: 0.42,
    metalness: 0.04,
  });

  const body = new THREE.Mesh(new THREE.BoxGeometry(W, H, D), cloth);
  body.position.y = H / 2;
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  const roof = new THREE.Mesh(new THREE.BoxGeometry(W + 0.12, 0.22, D + 0.12), clothDetail);
  roof.position.y = H + 0.05;
  roof.castShadow = true;
  group.add(roof);

  // Marble shadharwan / base skirt
  const skirtH = 0.28;
  [
    new THREE.Vector3(0, skirtH / 2, hz + 0.08),
    new THREE.Vector3(0, skirtH / 2, -(hz + 0.08)),
  ].forEach((pos, index) => {
    const panel = new THREE.Mesh(new THREE.BoxGeometry(W + 0.35, skirtH, 0.22), marble);
    panel.position.copy(pos);
    if (index === 1) panel.rotation.y = Math.PI;
    group.add(panel);
  });
  [
    new THREE.Vector3(hx + 0.08, skirtH / 2, 0),
    new THREE.Vector3(-(hx + 0.08), skirtH / 2, 0),
  ].forEach((pos) => {
    const panel = new THREE.Mesh(new THREE.BoxGeometry(0.22, skirtH, D + 0.2), marble);
    panel.position.copy(pos);
    group.add(panel);
  });

  // Raised gold Hizam belt (physical relief over texture)
  const beltY = KAABA.hizamCenterY;
  const beltH = KAABA.hizamHeight;
  const beltFront = new THREE.Mesh(new THREE.BoxGeometry(W - 0.08, beltH, 0.08), gold);
  beltFront.position.set(0, beltY, hz + 0.02);
  group.add(beltFront);
  const beltBack = beltFront.clone();
  beltBack.position.z = -(hz + 0.02);
  group.add(beltBack);
  const beltSide = new THREE.Mesh(new THREE.BoxGeometry(0.08, beltH, D - 0.08), gold);
  beltSide.position.set(hx + 0.02, beltY, 0);
  group.add(beltSide);
  const beltSide2 = beltSide.clone();
  beltSide2.position.x = -(hx + 0.02);
  group.add(beltSide2);

  // Kiswa fold seams
  for (let x = -hx + 0.7; x <= hx - 0.7; x += 0.85) {
    const fold = new THREE.Mesh(new THREE.BoxGeometry(0.04, H * 0.55, 0.03), clothDetail);
    fold.position.set(x, H * 0.36, hz + 0.01);
    group.add(fold);
    const foldBack = fold.clone();
    foldBack.position.z = -(hz + 0.01);
    group.add(foldBack);
  }
  for (let z = -hz + 0.7; z <= hz - 0.7; z += 0.85) {
    const fold = new THREE.Mesh(new THREE.BoxGeometry(0.03, H * 0.55, 0.04), clothDetail);
    fold.position.set(hx + 0.01, H * 0.36, z);
    group.add(fold);
    const foldL = fold.clone();
    foldL.position.x = -(hx + 0.01);
    group.add(foldL);
  }

  // Door of Mercy — elevated gold door toward Black Stone side
  const doorX = KAABA.doorOffsetX;
  const doorY = KAABA.doorBottom + KAABA.doorHeight / 2;
  const frame = new THREE.Mesh(
    new THREE.BoxGeometry(KAABA.doorWidth + 0.28, KAABA.doorHeight + 0.35, 0.16),
    gold,
  );
  frame.position.set(doorX, doorY, hz + 0.08);
  group.add(frame);

  const doorMat = new THREE.MeshStandardMaterial({
    map: maps.door,
    color: 0xffffff,
    roughness: 0.3,
    metalness: 0.78,
    envMap: maps.env,
    envMapIntensity: 0.9,
  });
  const door = new THREE.Mesh(
    new THREE.BoxGeometry(KAABA.doorWidth, KAABA.doorHeight, 0.14),
    doorMat,
  );
  door.position.set(doorX, doorY, hz + 0.16);
  group.add(door);

  const sitara = new THREE.Mesh(new THREE.BoxGeometry(KAABA.doorWidth + 0.7, 0.55, 0.12), gold);
  sitara.position.set(doorX, KAABA.doorBottom + KAABA.doorHeight + 0.45, hz + 0.12);
  group.add(sitara);

  // Hajar al-Aswad — eastern / left door-face corner
  const stoneX = -hx + 0.05;
  const stoneZ = hz - 0.05;
  const silverFrame = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.1, 18, 48), silver);
  silverFrame.position.set(stoneX, KAABA.blackStoneHeight, stoneZ);
  silverFrame.rotation.y = Math.PI / 4;
  silverFrame.castShadow = true;
  group.add(silverFrame);

  const blackStone = new THREE.Mesh(
    new THREE.SphereGeometry(0.28, 28, 20),
    material(0x050505, { roughness: 0.55, metalness: 0.08 }),
  );
  blackStone.position.set(stoneX - 0.04, KAABA.blackStoneHeight, stoneZ + 0.04);
  blackStone.scale.set(0.72, 1.05, 0.28);
  group.add(blackStone);

  // Mizab al-Rahmah — roof spout toward Hijr (+X)
  const mizab = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.14, KAABA.mizabLength, 20),
    gold,
  );
  mizab.rotation.z = -Math.PI / 2;
  mizab.position.set(hx + KAABA.mizabLength / 2 - 0.05, H - 0.15, 0);
  group.add(mizab);
  const lip = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.13, 0.32, 20), gold);
  lip.rotation.z = -Math.PI / 2;
  lip.position.set(hx + KAABA.mizabLength - 0.05, H - 0.15, 0);
  group.add(lip);
  [-0.35, 0.35].forEach((z) => {
    const brace = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.45, 0.14), darkGold);
    brace.position.set(hx - 0.2, H - 0.35, z);
    group.add(brace);
  });

  // Corner seams
  [
    [hx - 0.05, hz - 0.05],
    [-hx + 0.05, hz - 0.05],
    [hx - 0.05, -hz + 0.05],
    [-hx + 0.05, -hz + 0.05],
  ].forEach(([x, z]) => {
    const seam = new THREE.Mesh(new THREE.BoxGeometry(0.12, H - 0.2, 0.12), clothDetail);
    seam.position.set(x, H / 2, z);
    group.add(seam);
  });

  // Soft fill light on door face for readability
  const doorLight = new THREE.PointLight(0xffe6b0, 4.5, 18, 2);
  doorLight.position.set(doorX, 5.5, hz + 4);
  group.add(doorLight);

  context.root.add(group);
  makeClickable(context, group, key);
  return group;
}

export function createMaqam(context, position, scale = 1, parent = context.root) {
  const group = new THREE.Group();
  group.position.copy(position);
  group.scale.setScalar(scale);
  const maps = textures();
  const gold = goldMaterial();

  const footprint = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.2, 0.42), material(0x8c7551));
  footprint.position.y = 0.55;
  group.add(footprint);

  for (let index = 0; index < 8; index += 1) {
    const angle = index / 8 * Math.PI * 2;
    const pole = cylinder(0.04, 0.05, 1.85, 0xd4af37, 10, { roughness: 0.3, metalness: 0.8 });
    pole.material = gold;
    pole.position.set(Math.cos(angle) * 0.62, 1.05, Math.sin(angle) * 0.62);
    group.add(pole);
  }

  const base = cylinder(0.78, 0.84, 0.22, 0xd4af37, 10, { roughness: 0.3, metalness: 0.8 });
  base.material = gold;
  base.position.y = 0.12;
  group.add(base);

  const top = cylinder(0.5, 0.7, 0.24, 0xd4af37, 10, { roughness: 0.3, metalness: 0.8 });
  top.material = gold;
  top.position.y = 2.0;
  group.add(top);

  const glass = new THREE.Mesh(
    new THREE.CylinderGeometry(0.7, 0.7, 1.7, 10),
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.18,
      transmission: 0.88,
      roughness: 0.04,
      thickness: 0.4,
      depthWrite: false,
      envMap: maps.env,
      envMapIntensity: 0.6,
    }),
  );
  glass.position.y = 1.05;
  group.add(glass);
  parent.add(group);
  return group;
}

/** Hijr Ismail / Hatim — low white-marble semicircle on the +X (NW) side. */
export function createHatim(parent, scale = 1) {
  const maps = textures();
  const marble = new THREE.MeshStandardMaterial({
    map: maps.marble,
    color: 0xf7f3ea,
    roughness: 0.38,
    metalness: 0.04,
  });
  const marbleTop = new THREE.MeshStandardMaterial({
    map: maps.marble,
    color: 0xffffff,
    roughness: 0.32,
    metalness: 0.05,
  });

  const group = new THREE.Group();
  group.scale.setScalar(scale);
  parent.add(group);

  const hx = KAABA.widthX / 2;
  const hz = KAABA.depthZ / 2;
  const wallH = KAABA.hatimHeight;
  const thick = KAABA.hatimThickness;
  const centerX = hx + 0.08;
  const innerR = KAABA.hatimDepth;
  const outerR = innerR + thick;
  const halfSpan = KAABA.hatimOpening / 2;
  const cornerClearance = Math.min(hz - 0.35, halfSpan);
  const a0 = -Math.asin(Math.min(0.98, cornerClearance / innerR));
  const a1 = -a0;
  const segments = 64;

  const shape = new THREE.Shape();
  for (let i = 0; i <= segments; i += 1) {
    const angle = a0 + (i / segments) * (a1 - a0);
    const x = centerX + Math.cos(angle) * outerR;
    const z = Math.sin(angle) * outerR;
    if (i === 0) shape.moveTo(x, z);
    else shape.lineTo(x, z);
  }
  for (let i = segments; i >= 0; i -= 1) {
    const angle = a0 + (i / segments) * (a1 - a0);
    shape.lineTo(
      centerX + Math.cos(angle) * innerR,
      Math.sin(angle) * innerR,
    );
  }
  shape.closePath();

  const wall = new THREE.Mesh(
    new THREE.ExtrudeGeometry(shape, {
      depth: wallH,
      bevelEnabled: true,
      bevelThickness: 0.04,
      bevelSize: 0.03,
      bevelSegments: 2,
    }),
    marble,
  );
  wall.rotation.x = -Math.PI / 2;
  wall.position.y = 0;
  wall.castShadow = true;
  wall.receiveShadow = true;
  group.add(wall);

  const topShape = new THREE.Shape();
  for (let i = 0; i <= segments; i += 1) {
    const angle = a0 + (i / segments) * (a1 - a0);
    const x = centerX + Math.cos(angle) * (outerR + 0.04);
    const z = Math.sin(angle) * (outerR + 0.04);
    if (i === 0) topShape.moveTo(x, z);
    else topShape.lineTo(x, z);
  }
  for (let i = segments; i >= 0; i -= 1) {
    const angle = a0 + (i / segments) * (a1 - a0);
    topShape.lineTo(
      centerX + Math.cos(angle) * (innerR - 0.04),
      Math.sin(angle) * (innerR - 0.04),
    );
  }
  topShape.closePath();
  const coping = new THREE.Mesh(
    new THREE.ExtrudeGeometry(topShape, { depth: 0.08, bevelEnabled: false }),
    marbleTop,
  );
  coping.rotation.x = -Math.PI / 2;
  coping.position.y = wallH;
  group.add(coping);

  [a0, a1].forEach((angle) => {
    const midR = (innerR + outerR) / 2;
    const post = new THREE.Mesh(
      new THREE.CylinderGeometry(thick * 0.48, thick * 0.52, wallH + 0.06, 16),
      marble,
    );
    post.position.set(
      centerX + Math.cos(angle) * midR,
      (wallH + 0.06) / 2,
      Math.sin(angle) * midR,
    );
    post.castShadow = true;
    group.add(post);
  });

  const floorShape = new THREE.Shape();
  floorShape.moveTo(hx + 0.12, -halfSpan * 0.92);
  for (let i = 0; i <= segments; i += 1) {
    const angle = a0 + (i / segments) * (a1 - a0);
    floorShape.lineTo(
      centerX + Math.cos(angle) * (innerR - 0.05),
      Math.sin(angle) * (innerR - 0.05),
    );
  }
  floorShape.lineTo(hx + 0.12, halfSpan * 0.92);
  floorShape.lineTo(hx + 0.12, -halfSpan * 0.92);

  const floor = new THREE.Mesh(
    new THREE.ShapeGeometry(floorShape),
    new THREE.MeshStandardMaterial({
      map: maps.marble,
      color: 0xf4efe6,
      roughness: 0.45,
      metalness: 0.02,
    }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0.06;
  floor.receiveShadow = true;
  group.add(floor);

  return { wall, floor, group };
}

export function kaabaLandmarkPositions(scale = 1) {
  const { widthX: W, depthZ: D, height: H } = KAABA;
  const hx = (W / 2) * scale;
  const hz = (D / 2) * scale;
  return {
    kaaba: new THREE.Vector3(0, 0, 0),
    door: new THREE.Vector3(KAABA.doorOffsetX * scale, 0, hz + 1.2 * scale),
    blackstone: new THREE.Vector3(-hx - 0.4 * scale, 0, hz + 0.35 * scale),
    rukn: new THREE.Vector3(-hx - 0.4 * scale, 0, -hz - 0.35 * scale),
    multazam: new THREE.Vector3((-hx + KAABA.doorOffsetX) * 0.55 * scale, 0, hz + 1.1 * scale),
    hijr: new THREE.Vector3(hx + (KAABA.hatimDepth * 0.55 + 0.5) * scale, 0, 0),
    mizab: new THREE.Vector3(hx + KAABA.mizabLength * scale, 0, 0),
    maqam: new THREE.Vector3(KAABA.doorOffsetX * scale, 0, hz + 8.4 * scale),
    doorHit: new THREE.Vector3(
      KAABA.doorOffsetX * scale,
      (KAABA.doorBottom + KAABA.doorHeight / 2) * scale,
      hz + 0.2 * scale,
    ),
    blackstoneHit: new THREE.Vector3(-hx, KAABA.blackStoneHeight * scale, hz),
    ruknHit: new THREE.Vector3(-hx, 1.4 * scale, -hz),
    multazamHit: new THREE.Vector3(
      (KAABA.doorOffsetX - hx) / 2 * scale,
      2.2 * scale,
      hz + 0.12 * scale,
    ),
    mizabHit: new THREE.Vector3(hx + KAABA.mizabLength * 0.55 * scale, (H - 0.2) * scale, 0),
  };
}
