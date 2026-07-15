import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DATA, ROUTE_KEYS, UI, languageIndex } from './data/index.js';
import { PhotoGallery } from './photoGallery.js';
import { buildHaram, buildSacredSites } from './three/scenes.js';

const query = (selector) => document.querySelector(selector);
const queryAll = (selector) => [...document.querySelectorAll(selector)];

export class HajjUmrahApp {
  constructor() {
    this.language = 'en';
    this.mode = 'hajj';
    this.selected = 'haram';
    this.playing = false;
    this.followRoute = false;
    this.routeTime = 0;
    this.labelsVisible = true;
    this.terrainVisible = true;
    this.done = this.readDoneState();
    this.clickable = [];
    this.labels = [];
    this.positions = {};
    this.routeCurve = null;
    this.traveller = null;
    this.root = null;
    this.lastFrameTime = 0;

    this.dom = {
      scene: query('#scene'),
      loading: query('#loading'),
      photo: query('#photo'),
      photoCredit: query('#photoCredit'),
      photoDots: query('#photoDots'),
      photoPrev: query('#photoPrev'),
      photoNext: query('#photoNext'),
      photoStage: query('.photoStage'),
      infoPanel: query('#infoPanel'),
    };

    this.photoGallery = new PhotoGallery({
      image: this.dom.photo,
      credit: this.dom.photoCredit,
      dots: this.dom.photoDots,
      previous: this.dom.photoPrev,
      next: this.dom.photoNext,
      stage: this.dom.photoStage,
      getTitle: () => query('#placeTitle')?.textContent || 'Sacred location',
    });
  }

  readDoneState() {
    try {
      return JSON.parse(localStorage.getItem('huDone') || '{}');
    } catch {
      return {};
    }
  }

  showError(error) {
    console.error(error);
    const message = error?.message || String(error);
    this.dom.loading.classList.remove('hide');
    this.dom.loading.innerHTML = `
      <div class="startupError">
        <h2>3D map could not start</h2>
        <p>${message.replace(/[<>&]/g, '')}</p>
        <button onclick="location.reload()">Retry</button>
      </div>`;
  }

  init() {
    try {
      if (!window.WebGLRenderingContext) {
        throw new Error('WebGL is disabled or unavailable. Enable hardware acceleration and use a modern browser.');
      }

      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x9db0a8);
      this.scene.fog = new THREE.FogExp2(0x9db0a8, 0.007);

      this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 500);
      this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.renderer.outputColorSpace = THREE.SRGBColorSpace;
      this.dom.scene.replaceChildren(this.renderer.domElement);

      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.07;
      this.controls.maxPolarAngle = Math.PI * 0.48;
      this.controls.minDistance = 5;
      this.controls.maxDistance = 190;

      this.raycaster = new THREE.Raycaster();
      this.pointer = new THREE.Vector2();

      const hemisphere = new THREE.HemisphereLight(0xfff5dc, 0x485c51, 2.4);
      this.scene.add(hemisphere);
      const sun = new THREE.DirectionalLight(0xfff0cb, 3.2);
      sun.position.set(-30, 55, 25);
      sun.castShadow = true;
      sun.shadow.mapSize.set(2048, 2048);
      sun.shadow.camera.left = -100;
      sun.shadow.camera.right = 100;
      sun.shadow.camera.top = 100;
      sun.shadow.camera.bottom = -100;
      this.scene.add(sun);

      this.addEvents();
      this.setUI();
      this.build();
      this.resize();
      requestAnimationFrame((time) => this.loop(time));
      window.setTimeout(() => this.dom.loading.classList.add('hide'), 500);
    } catch (error) {
      this.showError(error);
    }
  }

  get context() {
    return {
      mode: this.mode,
      root: this.root,
      clickable: this.clickable,
      labels: this.labels,
      positions: this.positions,
      routeCurve: this.routeCurve,
      traveller: this.traveller,
    };
  }

  applyContext(context) {
    this.root = context.root;
    this.clickable = context.clickable;
    this.labels = context.labels;
    this.positions = context.positions;
    this.routeCurve = context.routeCurve;
    this.traveller = context.traveller;
  }

  build() {
    if (this.root) this.scene.remove(this.root);
    this.root = new THREE.Group();
    this.scene.add(this.root);
    this.clickable = [];
    this.labels = [];
    this.positions = {};
    this.routeCurve = null;
    this.traveller = null;
    this.routeTime = 0;
    query('#routeSlider').value = '0';

    const context = {
      mode: this.mode,
      root: this.root,
      clickable: this.clickable,
      labels: this.labels,
      positions: this.positions,
      routeCurve: this.routeCurve,
      traveller: this.traveller,
    };
    const data = DATA[this.mode];
    const index = languageIndex(this.language);
    const result = this.mode === 'hajj'
      ? buildSacredSites(context, data, index)
      : buildHaram(context, data, index);

    this.applyContext(context);
    query('#scaleLabel').textContent = result.scaleLabel;
    this.labels.forEach((label) => { label.visible = this.labelsVisible; });
    this.root.traverse((object) => {
      if (object.userData.terrain) object.visible = this.terrainVisible;
    });

    this.renderLegend();
    this.renderRoute();
    this.resetView();

    const defaultSelection = this.mode === 'hajj' ? 'haram' : 'kaaba';
    this.select(DATA[this.mode][this.selected] ? this.selected : defaultSelection, false);
  }

  renderLegend() {
    const data = DATA[this.mode];
    const index = languageIndex(this.language);
    query('#legend').innerHTML = Object.entries(data)
      .map(([key, value]) => `<button data-key="${key}">${value.n[index]}</button>`)
      .join('');
    queryAll('#legend button').forEach((button) => {
      button.addEventListener('click', () => this.select(button.dataset.key));
    });
  }

  renderRoute() {
    const keys = ROUTE_KEYS[this.mode];
    const data = DATA[this.mode];
    const index = languageIndex(this.language);
    query('#routeSteps').innerHTML = keys
      .map((key) => `<button data-key="${key}">${data[key].n[index]}</button>`)
      .join('');
    queryAll('#routeSteps button').forEach((button) => {
      button.addEventListener('click', () => this.select(button.dataset.key));
    });
    query('#routeTotal').textContent = this.mode === 'hajj'
      ? '≈ 44 km route overview'
      : 'Tawaf + Sa‘i learning route';
  }

  select(key, focus = true) {
    const data = DATA[this.mode][key];
    if (!data) return;
    this.selected = key;
    const index = languageIndex(this.language);
    const ui = UI[this.language];

    query('#placeTitle').textContent = data.n[index];
    query('#placeArabic').textContent = data.a;
    query('#placeIntro').textContent = data.i[index];
    query('#dayValue').textContent = data.day;
    query('#distanceValue').textContent = data.d[index];
    query('#coordinatesValue').textContent = data.c
      ? `${data.c[0].toFixed(5)}° N, ${data.c[1].toFixed(5)}° E`
      : ui.localLandmark;
    query('#qualityBadge').textContent = data.c ? ui.coordinateBased : ui.educational;
    query('#qualityBadge').classList.toggle('approx', !data.c);
    query('#taskList').innerHTML = data.t[index]
      .map((task, taskIndex) => `<div class="task"><i>${taskIndex + 1}</i><span>${task}</span></div>`)
      .join('');
    query('#factList').innerHTML = data.f[index]
      .map((fact) => `<div class="fact"><span>${fact}</span></div>`)
      .join('');

    const hasDua = Boolean(data.dua[0]);
    query('#duaArabic').textContent = data.dua[0];
    query('#duaTrans').textContent = data.dua[1];
    query('#duaMeaning').textContent = data.dua[2];
    query('#duaSection').style.display = hasDua ? 'block' : 'none';
    this.photoGallery.setPhotos(data.p);

    const doneKey = `${this.mode}:${key}`;
    query('#completeBtn').textContent = this.done[doneKey] ? ui.completed : ui.complete;
    query('#completeBtn').classList.toggle('done', Boolean(this.done[doneKey]));

    queryAll('#legend button,#routeSteps button').forEach((button) => {
      button.classList.toggle('active', button.dataset.key === key);
    });

    if (focus) this.focusOn(key);
    if (window.innerWidth < 821) this.dom.infoPanel.classList.add('open');
  }

  focusOn(key) {
    const position = this.positions[key] || new THREE.Vector3();
    this.playing = false;
    this.followRoute = false;
    this.controls.enabled = true;
    this.controls.target.copy(position);
    this.camera.position.copy(position).add(
      this.mode === 'hajj'
        ? new THREE.Vector3(10, 10, 14)
        : new THREE.Vector3(8, 7, 10),
    );
    this.controls.update();
    this.setUI();
  }

  resetView() {
    this.playing = false;
    this.followRoute = false;
    this.controls.enabled = true;
    if (this.mode === 'hajj') {
      this.camera.position.set(0, 88, -118);
      this.controls.target.set(0, 0, 2);
      this.controls.minDistance = 18;
      this.controls.maxDistance = 190;
    } else {
      this.camera.position.set(34, 28, 46);
      this.controls.target.set(1, 1.25, 1.3);
      this.controls.minDistance = 7;
      this.controls.maxDistance = 120;
    }
    this.controls.update();
    this.setUI();
  }

  setUI() {
    const ui = UI[this.language];
    query('#hajjTab').textContent = ui.hajj;
    query('#haramTab').textContent = ui.haram;
    query('#resetText').textContent = ui.reset;
    query('#sceneHint').textContent = ui.hint;
    query('#selectedText').textContent = ui.selected;
    query('#tasksTitle').textContent = ui.tasks;
    query('#factsTitle').textContent = ui.facts;
    query('#duaTitle').textContent = ui.dua;
    query('#focusBtn').textContent = ui.focus;
    query('#listenBtn').textContent = ui.listen;
    query('#labelsText').textContent = ui.labels;
    query('#terrainText').textContent = ui.terrain;
    query('#routeText').textContent = this.playing ? ui.pause : ui.route;
    query('#dayLabel').textContent = ui.day;
    query('#distanceLabel').textContent = ui.distance;
    query('#coordinatesLabel').textContent = ui.coords;
    query('#mobilePanelBtn').textContent = ui.open;
    query('#accuracyText').textContent = ui.accuracy;
    query('#routeOverviewTitle').textContent = ui.routeOverview;
    query('#scaleNote').textContent = ui.note;
    query('#editorialNote').textContent = ui.editorial;
    query('#langBtn').textContent = this.language === 'en' ? 'ગુજરાતી' : 'English';
    queryAll('#modeTabs button').forEach((button) => {
      button.classList.toggle('active', button.dataset.mode === this.mode);
    });
  }

  speakSelected() {
    const data = DATA[this.mode][this.selected];
    const index = languageIndex(this.language);
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(
      `${data.n[index]}. ${data.i[index]}. ${data.t[index].join('. ')}`,
    );
    utterance.lang = this.language === 'gu' ? 'gu-IN' : 'en-US';
    window.speechSynthesis.speak(utterance);
  }

  toggleComplete() {
    const key = `${this.mode}:${this.selected}`;
    this.done[key] = !this.done[key];
    localStorage.setItem('huDone', JSON.stringify(this.done));
    this.select(this.selected, false);
  }

  addEvents() {
    window.addEventListener('resize', () => this.resize());

    this.renderer.domElement.addEventListener('pointerup', (event) => {
      const rect = this.renderer.domElement.getBoundingClientRect();
      this.pointer.set(
        (event.clientX - rect.left) / rect.width * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1,
      );
      this.raycaster.setFromCamera(this.pointer, this.camera);
      const hit = this.raycaster
        .intersectObjects(this.clickable, true)
        .find((intersection) => intersection.object.userData.key);
      if (hit) this.select(hit.object.userData.key);
    });

    queryAll('#modeTabs button').forEach((button) => {
      button.addEventListener('click', () => {
        this.mode = button.dataset.mode;
        this.selected = this.mode === 'hajj' ? 'haram' : 'kaaba';
        this.playing = false;
        this.followRoute = false;
        this.controls.enabled = true;
        this.setUI();
        this.build();
      });
    });

    query('#langBtn').addEventListener('click', () => {
      this.language = this.language === 'en' ? 'gu' : 'en';
      this.setUI();
      this.build();
    });
    query('#resetBtn').addEventListener('click', () => this.resetView());
    query('#focusBtn').addEventListener('click', () => this.focusOn(this.selected));
    query('#listenBtn').addEventListener('click', () => this.speakSelected());
    query('#completeBtn').addEventListener('click', () => this.toggleComplete());

    query('#labelsBtn').addEventListener('click', () => {
      this.labelsVisible = !this.labelsVisible;
      this.labels.forEach((label) => { label.visible = this.labelsVisible; });
      query('#labelsBtn').classList.toggle('active', this.labelsVisible);
    });

    query('#terrainBtn').addEventListener('click', () => {
      this.terrainVisible = !this.terrainVisible;
      this.root.traverse((object) => {
        if (object.userData.terrain) object.visible = this.terrainVisible;
      });
      query('#terrainBtn').classList.toggle('active', this.terrainVisible);
    });

    query('#routeBtn').addEventListener('click', () => {
      this.playing = !this.playing;
      this.followRoute = this.playing;
      this.controls.enabled = !this.playing;
      this.setUI();
    });

    query('#routeSlider').addEventListener('input', (event) => {
      this.routeTime = Number(event.target.value) / 1000;
      this.playing = false;
      this.followRoute = false;
      this.controls.enabled = true;
      this.setUI();
    });

    query('#mobilePanelBtn').addEventListener('click', () => this.dom.infoPanel.classList.add('open'));
    query('#closePanel').addEventListener('click', () => this.dom.infoPanel.classList.remove('open'));
  }

  resize() {
    const width = this.dom.scene.clientWidth;
    const height = this.dom.scene.clientHeight;
    if (!width || !height) return;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  }

  updateRouteCamera() {
    if (!this.routeCurve || !this.traveller) return;
    const point = this.routeCurve.getPoint(this.routeTime);
    this.traveller.position.copy(point).add(new THREE.Vector3(0, 0.85, 0));

    if (!this.playing || !this.followRoute) return;
    const ahead = this.routeCurve.getPoint((this.routeTime + 0.018) % 1);
    const direction = ahead.clone().sub(point);
    direction.y = 0;
    if (direction.lengthSq() < 0.0001) direction.set(0, 0, 1);
    direction.normalize();
    const side = new THREE.Vector3(-direction.z, 0, direction.x);
    const back = this.mode === 'hajj' ? 11 : 7.5;
    const height = this.mode === 'hajj' ? 8.5 : 5.2;
    const lateral = this.mode === 'hajj' ? 4.5 : 2.8;
    const desired = point.clone()
      .addScaledVector(direction, -back)
      .addScaledVector(side, lateral)
      .add(new THREE.Vector3(0, height, 0));
    this.camera.position.lerp(desired, 0.045);
    const look = ahead.clone().add(new THREE.Vector3(0, this.mode === 'hajj' ? 1.3 : 0.9, 0));
    this.controls.target.lerp(look, 0.075);
    this.camera.lookAt(this.controls.target);
  }

  updatePilgrims(time) {
    if (this.mode !== 'haram') return;
    this.root.traverse((object) => {
      if (!object.userData.pilgrim) return;
      const angle = (time * 0.00015 + object.userData.t) * Math.PI * 2;
      const radius = 8 + (object.userData.t % 3) * 1.7;
      object.position.set(Math.cos(angle) * radius, 0.2, Math.sin(angle) * radius);
    });
  }

  loop(time) {
    requestAnimationFrame((nextTime) => this.loop(nextTime));
    const delta = Math.min(50, time - this.lastFrameTime || 16.67);
    this.lastFrameTime = time;

    if (!this.playing && !this.controls.enabled) this.controls.enabled = true;
    if (this.playing && this.routeCurve) {
      this.routeTime = (this.routeTime + 0.00065 * (delta / 16.67)) % 1;
      query('#routeSlider').value = String(Math.round(this.routeTime * 1000));
    }

    this.updateRouteCamera();
    if (!this.playing || !this.followRoute) this.controls.update();
    this.updatePilgrims(time);
    this.renderer.render(this.scene, this.camera);
  }
}
