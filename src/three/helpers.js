import * as THREE from 'three';

export function material(color, options = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: options.roughness ?? 0.75,
    metalness: options.metalness ?? 0.04,
    ...options,
  });
}

export function box(width, height, depth, color, options) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(width, height, depth),
    material(color, options),
  );
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

export function cylinder(radiusTop, radiusBottom, height, color, segments = 20, options) {
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segments),
    material(color, options),
  );
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

export function sphere(radius, color, options) {
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(radius, 18, 12),
    material(color, options),
  );
  mesh.castShadow = true;
  return mesh;
}

export function projectCoordinate(latitude, longitude) {
  const scale = 4.35;
  const latitudeOrigin = 21.395;
  const longitudeOrigin = 39.905;
  return new THREE.Vector3(
    (longitude - longitudeOrigin) * 111.32 * Math.cos(latitudeOrigin * Math.PI / 180) * scale,
    0,
    (latitude - latitudeOrigin) * 111.32 * scale,
  );
}

export function makeClickable(context, object, key) {
  object.traverse?.((child) => {
    if (!child.isMesh) return;
    child.userData.key = key;
    context.clickable.push(child);
  });
}

export function addLabel(context, text, key, position) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 560;
  canvas.height = 112;

  if (typeof ctx.roundRect === 'function') {
    ctx.beginPath();
    ctx.roundRect(5, 5, 550, 102, 20);
  } else {
    ctx.beginPath();
    ctx.rect(5, 5, 550, 102);
  }
  ctx.fillStyle = 'rgba(5,47,40,.91)';
  ctx.fill();
  ctx.strokeStyle = '#d8b25a';
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.fillStyle = 'white';
  ctx.font = '700 27px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 280, 56);

  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: new THREE.CanvasTexture(canvas),
      transparent: true,
      depthTest: false,
    }),
  );
  sprite.position.copy(position).add(new THREE.Vector3(0, context.mode === 'hajj' ? 3.5 : 2.2, 0));
  sprite.scale.set(context.mode === 'hajj' ? 7.2 : 5.2, context.mode === 'hajj' ? 1.45 : 1.1, 1);
  sprite.userData.key = key;
  context.root.add(sprite);
  context.labels.push(sprite);
  context.clickable.push(sprite);
  return sprite;
}

export function addMarker(context, key, position, text) {
  const group = new THREE.Group();
  group.position.copy(position);
  const size = context.mode === 'hajj' ? 0.62 : 0.38;
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(size, 0.07, 10, 36),
    new THREE.MeshBasicMaterial({ color: 0xd8b25a }),
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.08;

  const orb = sphere(size * 0.38, 0xffdf83);
  orb.position.y = size * 0.95;
  orb.material.emissive = new THREE.Color(0x6c4c0e);
  orb.material.emissiveIntensity = 0.8;
  orb.userData.key = key;
  context.clickable.push(orb);

  group.add(ring, orb);
  context.root.add(group);
  addLabel(context, text, key, position);
  context.positions[key] = position.clone();
  return group;
}

export function addRouteTube(context, points, color = 0xd8b25a) {
  const curve = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.3);
  const tube = new THREE.Mesh(
    new THREE.TubeGeometry(curve, Math.max(100, points.length * 24), context.mode === 'hajj' ? 0.17 : 0.09, 10, false),
    new THREE.MeshStandardMaterial({
      color,
      emissive: new THREE.Color(color).multiplyScalar(0.25),
      roughness: 0.5,
      metalness: 0.1,
    }),
  );
  tube.position.y = 0.02;
  context.root.add(tube);

  const traveller = sphere(context.mode === 'hajj' ? 0.38 : 0.22, 0xffdf83);
  traveller.material.emissive = new THREE.Color(0x8c6117);
  traveller.material.emissiveIntensity = 1.2;
  context.root.add(traveller);

  context.routeCurve = curve;
  context.traveller = traveller;
  return curve;
}

export function addRockCluster(context, position, key) {
  const group = new THREE.Group();
  group.position.copy(position);
  for (let index = 0; index < 13; index += 1) {
    const angle = index / 13 * Math.PI * 2;
    const radius = 0.35 + (index % 3) * 0.24;
    const rock = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.32 + (index % 4) * 0.08, 0),
      material(index % 2 === 0 ? 0x9b8060 : 0x7d674d),
    );
    rock.position.set(Math.cos(angle) * radius, 0.24 + (index % 3) * 0.13, Math.sin(angle) * radius);
    rock.scale.set(1.3, 0.7, 1);
    group.add(rock);
  }
  context.root.add(group);
  makeClickable(context, group, key);
  return group;
}

export function transparentHitMesh(geometry, key) {
  const mesh = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.01, depthWrite: false }),
  );
  mesh.userData.key = key;
  return mesh;
}
