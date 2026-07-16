import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DATA, JOURNEYS, ROUTE_KEYS, UI, BOOK_SECTIONS, BOOK_META, languageIndex } from './data/index.js';
import { DuaAudio } from './audio.js';
import { PhotoGallery } from './photoGallery.js';
import { buildHaram, buildSacredSites } from './three/scenes.js';

const query = (selector) => document.querySelector(selector);
const queryAll = (selector) => [...document.querySelectorAll(selector)];
const CHECKLIST_KEY = 'huChecklist';
const DONE_KEY = 'huDone';
const CIRCUIT_KEY = 'huCircuits';

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
    this.guideOpen = false;
    this.journeyId = 'umrah';
    this.stepIndex = 0;
    this.walking = false;
    this.pilgrimMode = false;
    this.move = { forward: false, back: false, left: false, right: false };
    this.lookYaw = 0;
    this.lookPitch = -0.12;
    this.walkPointer = null;
    this.done = this.readJson(DONE_KEY, {});
    this.checklist = this.readJson(CHECKLIST_KEY, {});
    this.circuits = this.readJson(CIRCUIT_KEY, {});
    this.bookOpen = false;
    this.bookSectionId = BOOK_SECTIONS.find((s) => s.hasOcr)?.id || BOOK_SECTIONS[0]?.id || null;
    this.bookFilter = '';
    this.clickable = [];
    this.labels = [];
    this.positions = {};
    this.routeCurve = null;
    this.traveller = null;
    this.root = null;
    this.lastFrameTime = 0;
    this.activeDua = null;
    this.audio = new DuaAudio();

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
      guideController: query('#guideController'),
      routeController: query('#routeController'),
      walkHud: query('#walkHud'),
      pilgrimGate: query('#pilgrimGate'),
      pilgrimBanner: query('#pilgrimBanner'),
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

  readJson(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
    } catch {
      return fallback;
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

  toast(message) {
    const el = query('#toast');
    if (!el) return;
    el.textContent = message;
    el.classList.add('show');
    window.clearTimeout(this._toastTimer);
    this._toastTimer = window.setTimeout(() => el.classList.remove('show'), 2200);
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
      this.applyDeepLink();
      requestAnimationFrame((time) => this.loop(time));
      window.setTimeout(() => {
        this.dom.loading.classList.add('hide');
        if (!this.pilgrimMode) this.showPilgrimGate();
      }, 500);
    } catch (error) {
      this.showError(error);
    }
  }

  applyDeepLink() {
    const params = new URLSearchParams(window.location.search);
    const lang = params.get('lang');
    const mode = params.get('mode');
    const place = params.get('place');
    const journey = params.get('journey');
    const step = Number(params.get('step'));

    if (lang === 'en' || lang === 'gu') this.language = lang;
    if (mode === 'hajj' || mode === 'haram') {
      this.mode = mode;
      this.selected = place && DATA[mode]?.[place] ? place : (mode === 'hajj' ? 'haram' : 'kaaba');
      this.setUI();
      this.build();
    }
    if (journey && JOURNEYS[journey]) {
      this.journeyId = journey;
      this.stepIndex = Number.isFinite(step) ? Math.max(0, Math.min(step, JOURNEYS[journey].steps.length - 1)) : 0;
      this.guideOpen = true;
      this.renderGuide();
      this.applyGuideStep(false);
    }
    if (params.get('pov') === 'umrah' || params.get('pov') === 'hajj') {
      this.startPilgrimJourney(params.get('pov'));
    }
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
    if (this.walking) this.setWalking(false);
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
    this.updateGuideVisibility();
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
      ? 'Haram → Mina → Arafah ≈ 20+ km overview'
      : 'Tawaf + Sa‘i learning route';
  }

  currentGuideStep() {
    return JOURNEYS[this.journeyId]?.steps[this.stepIndex] || null;
  }

  updateGuideVisibility() {
    const open = this.guideOpen;
    this.dom.guideController.hidden = !open;
    this.dom.routeController.classList.toggle('dimmed', open);
    query('.sceneShell')?.classList.toggle('guide-open', open);
    query('#guideBtn')?.classList.toggle('active', open);
    query('#guideBtn')?.setAttribute('aria-pressed', open ? 'true' : 'false');
    query('#guidePanelSection').hidden = !open;
    if (open) this.renderGuide();
  }

  renderGuide() {
    const ui = UI[this.language];
    const journey = JOURNEYS[this.journeyId];
    const step = this.currentGuideStep();
    const index = languageIndex(this.language);
    if (!journey || !step) return;

    query('#guideUmrahTab').textContent = ui.guideUmrah;
    query('#guideHajjTab').textContent = ui.guideHajj;
    query('#guidePrev').textContent = ui.guidePrev;
    query('#guideNext').textContent = ui.guideNext;
    queryAll('#guideTabs button').forEach((button) => {
      button.classList.toggle('active', button.dataset.journey === this.journeyId);
    });

    query('#guideProgress').textContent = `${ui.guideStep} ${this.stepIndex + 1}/${journey.steps.length}`;
    query('#guideStepTitle').textContent = step.title[index];
    query('#guideStepBody').textContent = step.body[index];

    const whenItems = step.when?.[index] || [];
    const whereItems = step.where?.[index] || [];
    const meta = query('#guideMeta');
    if (meta) {
      const hasMeta = whenItems.length > 0 || whereItems.length > 0;
      meta.hidden = !hasMeta;
      query('#guideWhenLabel').textContent = ui.whenTitle;
      query('#guideWhereLabel').textContent = ui.whereTitle;
      query('#guideWhenList').innerHTML = whenItems.map((item) => `<li>${item}</li>`).join('');
      query('#guideWhereList').innerHTML = whereItems.map((item) => `<li>${item}</li>`).join('');
    }

    query('#guideDots').innerHTML = journey.steps
      .map((_, i) => `<button type="button" data-step="${i}" class="${i === this.stepIndex ? 'active' : ''}" aria-label="${ui.guideStep} ${i + 1}"></button>`)
      .join('');
    queryAll('#guideDots button').forEach((button) => {
      button.addEventListener('click', () => {
        this.stepIndex = Number(button.dataset.step);
        this.applyGuideStep();
      });
    });
    query('#guidePrev').disabled = this.stepIndex === 0;
    query('#guideNext').textContent = this.stepIndex === journey.steps.length - 1 ? ui.completed : ui.guideNext;

    this.renderGuidePanel(step, index, ui);
    this.renderCircuitBar(step, index, ui);
  }

  circuitKey(step) {
    return `${this.journeyId}:${step.id}`;
  }

  getCircuitCount(step) {
    if (!step?.circuits) return 0;
    return Math.max(0, Math.min(step.circuits.total, Number(this.circuits[this.circuitKey(step)] || 0)));
  }

  setCircuitCount(step, value) {
    if (!step?.circuits) return;
    const total = step.circuits.total;
    const next = Math.max(0, Math.min(total, value));
    this.circuits[this.circuitKey(step)] = next;
    localStorage.setItem(CIRCUIT_KEY, JSON.stringify(this.circuits));
    this.renderCircuitBar(step, languageIndex(this.language), UI[this.language]);
    if (next === total) this.toast(UI[this.language].circuitDone);
  }

  renderCircuitBar(step, index, ui) {
    const bar = query('#circuitBar');
    if (!bar) return;
    const has = Boolean(step?.circuits);
    bar.hidden = !has;
    if (!has) return;

    const total = step.circuits.total;
    const count = this.getCircuitCount(step);
    const label = step.circuits.label?.[index] || ui.circuitTitle;
    query('#circuitLabel').textContent = label;
    query('#circuitCount').textContent = `${count} ${ui.circuitOf} ${total}`;
    query('#circuitFill').style.width = `${(count / total) * 100}%`;
    query('#circuitPlus').textContent = ui.circuitPlus;
    query('#circuitMinus').textContent = ui.circuitMinus;
    query('#circuitReset').textContent = ui.circuitReset;
    query('#circuitPlus').disabled = count >= total;
    query('#circuitMinus').disabled = count <= 0;
    bar.classList.toggle('complete', count >= total);
  }

  openBook(sectionId = null) {
    this.bookOpen = true;
    if (sectionId) this.bookSectionId = sectionId;
    query('#bookOverlay').hidden = false;
    this.renderBook();
  }

  closeBook() {
    this.bookOpen = false;
    query('#bookOverlay').hidden = true;
  }

  renderBook() {
    const ui = UI[this.language];
    const index = languageIndex(this.language);
    query('#bookModalTitle').textContent = BOOK_META.title[index];
    query('#bookModalNote').textContent = BOOK_META.note[index];
    query('#bookCloseBtn').textContent = ui.bookClose;
    query('#bookSearch').placeholder = ui.bookSearch;
    query('#bookBtnText').textContent = ui.bookBtn;

    const filter = this.bookFilter.trim().toLowerCase();
    const list = BOOK_SECTIONS.filter((section) => {
      if (!filter) return true;
      return `${section.index} ${section.titleEn} ${section.titleGu}`.toLowerCase().includes(filter);
    });

    query('#bookIndexList').innerHTML = list.map((section) => {
      const title = index === 1 ? section.titleGu : section.titleEn;
      const badge = section.hasOcr ? ui.bookHasText : ui.bookNoText;
      const active = section.id === this.bookSectionId ? 'active' : '';
      const ocrClass = section.hasOcr ? 'has-ocr' : '';
      return `<button type="button" class="bookIndexItem ${active} ${ocrClass}" data-book-id="${section.id}">
        <span class="idx">${section.index}</span>
        <span class="ttl">${title}</span>
        <span class="meta">${ui.bookPage}${section.bookPage} · ${badge}</span>
      </button>`;
    }).join('');

    queryAll('#bookIndexList [data-book-id]').forEach((button) => {
      button.addEventListener('click', () => {
        this.bookSectionId = button.dataset.bookId;
        this.renderBook();
      });
    });

    const section = BOOK_SECTIONS.find((item) => item.id === this.bookSectionId) || list[0] || BOOK_SECTIONS[0];
    if (!section) return;
    this.bookSectionId = section.id;
    const title = index === 1 ? section.titleGu : section.titleEn;
    query('#bookSectionIndex').textContent = `${ui.bookIndex} ${section.index}`;
    query('#bookSectionTitle').textContent = title;
    const end = section.bookPageEnd && section.bookPageEnd !== section.bookPage
      ? `–${section.bookPageEnd}`
      : '';
    query('#bookSectionMeta').textContent = `${ui.bookPage}${section.bookPage}${end}`;
    const ocrEl = query('#bookOcrText');
    ocrEl.textContent = section.hasOcr && section.text
      ? section.text
      : ui.bookOcrMissing;
    ocrEl.setAttribute('dir', 'auto');
    ocrEl.lang = 'gu';
  }

  renderGuidePanel(step, index, ui) {
    query('#whenTitle').textContent = ui.whenTitle;
    query('#whereTitle').textContent = ui.whereTitle;
    query('#doTitle').textContent = ui.doTitle;
    query('#dontTitle').textContent = ui.dontTitle;
    query('#checklistTitle').textContent = ui.checklistTitle;

    const listHtml = (items) =>
      (items || []).map((item, i) => `<div class="task"><i>${i + 1}</i><span>${item}</span></div>`).join('');

    query('#whenList').innerHTML = listHtml(step.when?.[index]);
    query('#whereList').innerHTML = listHtml(step.where?.[index]);
    query('#doList').innerHTML = listHtml(step.do[index]);
    query('#dontList').innerHTML = step.dont[index]
      .map((item) => `<div class="mistake"><span>${item}</span></div>`)
      .join('');

    const prefix = `${this.journeyId}:${step.id}`;
    query('#checkList').innerHTML = step.checklist[index]
      .map((label, i) => {
        const key = `${prefix}:${i}`;
        const checked = Boolean(this.checklist[key]);
        return `<label class="checkItem"><input type="checkbox" data-check="${key}" ${checked ? 'checked' : ''}/><span>${label}</span></label>`;
      })
      .join('');
    queryAll('#checkList input').forEach((input) => {
      input.addEventListener('change', () => {
        this.checklist[input.dataset.check] = input.checked;
        localStorage.setItem(CHECKLIST_KEY, JSON.stringify(this.checklist));
      });
    });
  }

  applyGuideStep(focus = true) {
    const step = this.currentGuideStep();
    if (!step) return;
    const index = languageIndex(this.language);
    this.renderGuide();

    if (step.dua?.[0]) this.activeDua = step.dua;

    if (step.scene && step.scene !== this.mode) {
      this.mode = step.scene;
      this.selected = step.place || (this.mode === 'hajj' ? 'haram' : 'kaaba');
      this.setUI();
      this.build();
      if (step.place) this.select(step.place, focus && !this.pilgrimMode);
      this.overlayGuideDua(step);
      if (this.pilgrimMode) {
        this.setPilgrimBanner(step.title[index], step.body[index], true);
        if (this.mode === 'haram' && this.journeyId === 'umrah') this.enterArrivalWalk();
      }
      return;
    }

    if (step.place && DATA[this.mode][step.place]) {
      this.select(step.place, focus && !(this.pilgrimMode && this.walking));
    }
    this.overlayGuideDua(step);
    if (this.pilgrimMode) {
      this.setPilgrimBanner(step.title[index], step.body[index], true);
    }
    if (window.innerWidth < 821 && !this.pilgrimMode) this.dom.infoPanel.classList.add('open');
  }

  overlayGuideDua(step) {
    if (!step?.dua?.[0]) return;
    const index = languageIndex(this.language);
    query('#duaArabic').textContent = step.dua[0];
    query('#duaTrans').textContent = step.dua[1];
    query('#duaMeaning').textContent = step.dua[2] || step.dua[index === 1 ? 2 : 1];
    query('#duaSection').style.display = 'block';
    this.activeDua = step.dua;
    this.setDuaPlayLabel(false);
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
    this.activeDua = hasDua ? data.dua : null;
    this.setDuaPlayLabel(false);
    this.photoGallery.setPhotos(data.p);

    const doneKey = `${this.mode}:${key}`;
    query('#completeBtn').textContent = this.done[doneKey] ? ui.completed : ui.complete;
    query('#completeBtn').classList.toggle('done', Boolean(this.done[doneKey]));

    queryAll('#legend button,#routeSteps button').forEach((button) => {
      button.classList.toggle('active', button.dataset.key === key);
    });

    if (this.guideOpen) {
      const step = this.currentGuideStep();
      if (step) this.renderGuidePanel(step, index, ui);
    }

    if (focus) this.focusOn(key);
    if (window.innerWidth < 821) this.dom.infoPanel.classList.add('open');
  }

  focusOn(key) {
    if (this.pilgrimMode && this.walking) return;
    if (this.walking) this.setWalking(false);
    const position = this.positions[key] || new THREE.Vector3();
    this.playing = false;
    this.followRoute = false;
    this.controls.enabled = true;
    this.controls.target.copy(position);
    this.camera.position.copy(position).add(
      this.mode === 'hajj'
        ? new THREE.Vector3(16, 18, 22)
        : new THREE.Vector3(14, 11, 16),
    );
    this.controls.update();
    this.setUI();
  }

  resetView() {
    if (this.walking) this.setWalking(false);
    this.playing = false;
    this.followRoute = false;
    this.controls.enabled = true;
    if (this.mode === 'hajj') {
      this.camera.position.set(8, 145, -195);
      this.controls.target.set(0, 0, -4);
      this.controls.minDistance = 35;
      this.controls.maxDistance = 320;
      this.scene.background = new THREE.Color(0x9db0a8);
      this.scene.fog = new THREE.FogExp2(0x9db0a8, 0.0032);
    } else {
      this.camera.position.set(48, 32, 58);
      this.controls.target.set(1, 4, 1.5);
      this.controls.minDistance = 10;
      this.controls.maxDistance = 160;
      this.scene.background = new THREE.Color(0xb8c6c0);
      this.scene.fog = new THREE.FogExp2(0xb8c6c0, 0.0045);
    }
    this.controls.update();
    this.setUI();
  }

  setDuaPlayLabel(playing) {
    const ui = UI[this.language];
    query('#duaPlayBtn').textContent = playing ? ui.stopDua : ui.playDua;
  }

  setUI() {
    const ui = UI[this.language];
    query('#hajjTab').textContent = ui.hajj;
    query('#haramTab').textContent = ui.haram;
    query('#resetText').textContent = ui.reset;
    query('#sceneHint').textContent = this.walking ? ui.walkHint : ui.hint;
    query('#selectedText').textContent = ui.selected;
    query('#tasksTitle').textContent = ui.tasks;
    query('#factsTitle').textContent = ui.facts;
    query('#duaTitle').textContent = ui.dua;
    query('#focusBtn').textContent = ui.focus;
    query('#listenBtn').textContent = ui.listen;
    query('#labelsText').textContent = ui.labels;
    query('#terrainText').textContent = ui.terrain;
    query('#walkText').textContent = this.walking ? ui.walkExit : ui.walk;
    query('#routeText').textContent = this.playing ? ui.pause : ui.route;
    query('#dayLabel').textContent = ui.day;
    query('#distanceLabel').textContent = ui.distance;
    query('#coordinatesLabel').textContent = ui.coords;
    query('#mobilePanelBtn').textContent = ui.open;
    query('#accuracyText').textContent = ui.accuracy;
    query('#routeOverviewTitle').textContent = ui.routeOverview;
    query('#scaleNote').textContent = ui.note;
    query('#editorialNote').textContent = ui.editorial;
    query('#guideBtnText').textContent = ui.guide;
    query('#bookBtnText').textContent = ui.bookBtn;
    query('#povBtnText').textContent = ui.pov;
    query('#walkHintText').textContent = this.pilgrimMode && this.walking ? ui.povHint : ui.walkHint;
    query('#walkExitBtn').textContent = ui.walkExit;
    query('#langBtn').textContent = this.language === 'en' ? 'ગુજરાતી' : 'English';
    query('#walkBtn')?.classList.toggle('active', this.walking);
    query('#walkBtn').disabled = this.mode !== 'haram';
    query('#povBtn')?.classList.toggle('active', this.pilgrimMode);
    if (this.pilgrimMode && this.walking) {
      query('#sceneHint').textContent = ui.povHint;
      query('#accuracyText').textContent = ui.arrivalTitle;
    }
    queryAll('#modeTabs button').forEach((button) => {
      button.classList.toggle('active', button.dataset.mode === this.mode);
    });
    this.setDuaPlayLabel(false);
    if (this.guideOpen) this.renderGuide();
    if (this.bookOpen) this.renderBook();
    if (!this.dom.pilgrimGate.hidden) this.showPilgrimGate();
  }

  speakSelected() {
    const data = DATA[this.mode][this.selected];
    const index = languageIndex(this.language);
    this.audio.speakLocation({
      title: data.n[index],
      intro: data.i[index],
      tasks: data.t[index],
      language: this.language,
    });
  }

  playActiveDua() {
    if (!this.activeDua?.[0]) return;
    const ui = UI[this.language];
    const playing = query('#duaPlayBtn').textContent === ui.stopDua;
    if (playing) {
      this.audio.stop();
      this.setDuaPlayLabel(false);
      return;
    }
    this.audio.speakParts({
      arabic: this.activeDua[0],
      transliteration: this.activeDua[1],
      meaning: this.activeDua[2],
      language: this.language,
    });
    this.setDuaPlayLabel(true);
  }

  toggleComplete() {
    const key = `${this.mode}:${this.selected}`;
    this.done[key] = !this.done[key];
    localStorage.setItem(DONE_KEY, JSON.stringify(this.done));
    this.select(this.selected, false);
  }

  showPilgrimGate() {
    const ui = UI[this.language];
    query('#pilgrimEyebrow').textContent = ui.pilgrimEyebrow;
    query('#pilgrimTitle').textContent = ui.pilgrimTitle;
    query('#pilgrimLead').textContent = ui.pilgrimLead;
    query('#startUmrahLabel').textContent = ui.startUmrah;
    query('#startUmrahHint').textContent = ui.startUmrahHint;
    query('#startHajjLabel').textContent = ui.startHajj;
    query('#startHajjHint').textContent = ui.startHajjHint;
    query('#exploreMapBtn').textContent = ui.exploreMap;
    this.dom.pilgrimGate.hidden = false;
  }

  hidePilgrimGate() {
    this.dom.pilgrimGate.hidden = true;
  }

  setPilgrimBanner(title, body, showContinue = true) {
    const ui = UI[this.language];
    query('#pilgrimBannerTitle').textContent = title;
    query('#pilgrimBannerBody').textContent = body;
    query('#pilgrimContinueBtn').textContent = ui.pilgrimContinue;
    query('#exitPilgrimBtn').textContent = ui.exitPov;
    query('#pilgrimContinueBtn').hidden = !showContinue;
    this.dom.pilgrimBanner.hidden = false;
  }

  hidePilgrimBanner() {
    this.dom.pilgrimBanner.hidden = true;
  }

  startPilgrimJourney(kind) {
    this.hidePilgrimGate();
    this.pilgrimMode = true;
    document.body.classList.add('pilgrim-mode');
    this.journeyId = kind === 'hajj' ? 'hajj' : 'umrah';
    this.stepIndex = 0;
    this.guideOpen = true;

    if (kind === 'umrah') {
      this.enterUmrahArrival();
    } else {
      this.enterHajjArrival();
    }
  }

  enterUmrahArrival() {
    const ui = UI[this.language];
    this.mode = 'haram';
    this.selected = 'kaaba';
    this.playing = false;
    this.followRoute = false;
    this.setUI();
    this.build();
    this.updateGuideVisibility();
    this.applyGuideStep(false);
    this.enterArrivalWalk();
    this.setPilgrimBanner(ui.arrivalTitle, ui.arrivalBody, true);
    this.dom.infoPanel.classList.remove('open');
    query('#accuracyText').textContent = ui.povHint;
  }

  enterHajjArrival() {
    const ui = UI[this.language];
    this.mode = 'hajj';
    this.selected = 'haram';
    this.playing = false;
    this.followRoute = false;
    if (this.walking) this.setWalking(false, { keepView: true });
    this.setUI();
    this.build();
    this.updateGuideVisibility();
    this.applyGuideStep(true);
    // Cinematic pilgrim overlook — elevated view toward the Haram
    this.camera.position.set(-55, 42, 48);
    this.controls.target.set(-35, 2, 13);
    this.controls.enabled = true;
    this.controls.update();
    this.setPilgrimBanner(ui.hajjArrivalTitle, ui.hajjArrivalBody, true);
    query('#accuracyText').textContent = ui.hajjArrivalTitle;
  }

  enterArrivalWalk() {
    this.walking = true;
    this.playing = false;
    this.followRoute = false;
    this.controls.enabled = false;
    this.dom.walkHud.hidden = false;
    query('#walkBtn')?.classList.toggle('active', true);
    // First-person arrival: stand on the door-side mataf looking at the Kaaba
    this.camera.position.set(-1.2, 1.7, 22);
    this.lookYaw = Math.PI;
    this.lookPitch = -0.04;
    this.updateWalkLook();
    this.setUI();
  }

  continuePilgrimJourney() {
    this.hidePilgrimBanner();
    if (this.journeyId === 'umrah' && this.walking) {
      this.dom.infoPanel.classList.add('open');
      this.toast(UI[this.language].guideNext);
      return;
    }
    if (this.journeyId === 'hajj') {
      this.stepIndex = Math.min(this.stepIndex + 1, JOURNEYS.hajj.steps.length - 1);
      this.applyGuideStep(true);
      const step = this.currentGuideStep();
      const index = languageIndex(this.language);
      if (step) {
        this.setPilgrimBanner(step.title[index], step.body[index], true);
      }
    }
  }

  exitPilgrimMode() {
    this.pilgrimMode = false;
    document.body.classList.remove('pilgrim-mode');
    this.hidePilgrimBanner();
    this.hidePilgrimGate();
    if (this.walking) this.setWalking(false);
    this.guideOpen = false;
    this.updateGuideVisibility();
    this.setUI();
    this.resetView();
  }

  setWalking(enabled, options = {}) {
    if (enabled && this.mode !== 'haram') {
      this.toast(UI[this.language].walk);
      return;
    }
    this.walking = enabled;
    this.playing = false;
    this.followRoute = false;
    this.controls.enabled = !enabled;
    this.dom.walkHud.hidden = !enabled;
    query('#walkBtn')?.classList.toggle('active', enabled);

    if (enabled) {
      if (options.arrival) {
        this.enterArrivalWalk();
        return;
      }
      const anchor = this.positions[this.selected] || new THREE.Vector3(12, 0, 12);
      this.camera.position.set(anchor.x + 10, 1.7, anchor.z + 10);
      this.lookYaw = Math.atan2(-(anchor.x - this.camera.position.x), -(anchor.z - this.camera.position.z));
      this.lookPitch = -0.08;
      this.updateWalkLook();
    } else {
      this.move = { forward: false, back: false, left: false, right: false };
      if (!options.keepView && !this.pilgrimMode) this.resetView();
    }
    this.setUI();
  }

  updateWalkLook() {
    const direction = new THREE.Vector3(
      Math.sin(this.lookYaw) * Math.cos(this.lookPitch),
      Math.sin(this.lookPitch),
      Math.cos(this.lookYaw) * Math.cos(this.lookPitch),
    );
    this.controls.target.copy(this.camera.position).add(direction);
    this.camera.lookAt(this.controls.target);
  }

  updateWalk(delta) {
    if (!this.walking) return;
    const speed = 0.085 * (delta / 16.67);
    const forward = new THREE.Vector3(Math.sin(this.lookYaw), 0, Math.cos(this.lookYaw));
    const right = new THREE.Vector3(Math.sin(this.lookYaw + Math.PI / 2), 0, Math.cos(this.lookYaw + Math.PI / 2));
    const motion = new THREE.Vector3();
    if (this.move.forward) motion.add(forward);
    if (this.move.back) motion.sub(forward);
    if (this.move.left) motion.sub(right);
    if (this.move.right) motion.add(right);
    if (motion.lengthSq() > 0) {
      motion.normalize().multiplyScalar(speed);
      this.camera.position.add(motion);
      this.camera.position.y = 1.7;
      const radius = Math.hypot(this.camera.position.x, this.camera.position.z);
      if (radius > 55) {
        this.camera.position.x *= 55 / radius;
        this.camera.position.z *= 55 / radius;
      }
      if (radius < 9.5) {
        this.camera.position.x *= 9.5 / radius;
        this.camera.position.z *= 9.5 / radius;
      }
    }
    this.updateWalkLook();
  }

  addEvents() {
    window.addEventListener('resize', () => this.resize());

    this.renderer.domElement.addEventListener('pointerup', (event) => {
      if (this.walking) return;
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

    this.renderer.domElement.addEventListener('pointerdown', (event) => {
      if (!this.walking) return;
      this.walkPointer = { x: event.clientX, y: event.clientY };
      this.renderer.domElement.setPointerCapture(event.pointerId);
    });
    this.renderer.domElement.addEventListener('pointermove', (event) => {
      if (!this.walking || !this.walkPointer) return;
      const dx = event.clientX - this.walkPointer.x;
      const dy = event.clientY - this.walkPointer.y;
      this.walkPointer = { x: event.clientX, y: event.clientY };
      this.lookYaw -= dx * 0.005;
      this.lookPitch = Math.max(-1.2, Math.min(0.45, this.lookPitch - dy * 0.004));
      this.updateWalkLook();
    });
    this.renderer.domElement.addEventListener('pointerup', () => { this.walkPointer = null; });
    this.renderer.domElement.addEventListener('pointercancel', () => { this.walkPointer = null; });

    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        if (this.bookOpen) {
          this.closeBook();
          return;
        }
        if (this.walking) {
          if (this.pilgrimMode) this.exitPilgrimMode();
          else this.setWalking(false);
        }
      }
      if (!this.walking) return;
      if (['ArrowUp', 'w', 'W'].includes(event.key)) this.move.forward = true;
      if (['ArrowDown', 's', 'S'].includes(event.key)) this.move.back = true;
      if (['ArrowLeft', 'a', 'A'].includes(event.key)) this.move.left = true;
      if (['ArrowRight', 'd', 'D'].includes(event.key)) this.move.right = true;
    });
    window.addEventListener('keyup', (event) => {
      if (['ArrowUp', 'w', 'W'].includes(event.key)) this.move.forward = false;
      if (['ArrowDown', 's', 'S'].includes(event.key)) this.move.back = false;
      if (['ArrowLeft', 'a', 'A'].includes(event.key)) this.move.left = false;
      if (['ArrowRight', 'd', 'D'].includes(event.key)) this.move.right = false;
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

    query('#guideBtn').addEventListener('click', () => {
      this.guideOpen = !this.guideOpen;
      this.updateGuideVisibility();
      if (this.guideOpen) this.applyGuideStep(false);
    });
    query('#bookBtn').addEventListener('click', () => this.openBook());
    query('#bookCloseBtn').addEventListener('click', () => this.closeBook());
    query('#bookOverlay').addEventListener('click', (event) => {
      if (event.target === query('#bookOverlay')) this.closeBook();
    });
    query('#bookSearch').addEventListener('input', (event) => {
      this.bookFilter = event.target.value;
      this.renderBook();
    });
    query('#circuitPlus').addEventListener('click', () => {
      const step = this.currentGuideStep();
      if (!step?.circuits) return;
      this.setCircuitCount(step, this.getCircuitCount(step) + 1);
    });
    query('#circuitMinus').addEventListener('click', () => {
      const step = this.currentGuideStep();
      if (!step?.circuits) return;
      this.setCircuitCount(step, this.getCircuitCount(step) - 1);
    });
    query('#circuitReset').addEventListener('click', () => {
      const step = this.currentGuideStep();
      if (!step?.circuits) return;
      this.setCircuitCount(step, 0);
    });
    query('#povBtn').addEventListener('click', () => {
      if (this.pilgrimMode) this.exitPilgrimMode();
      else this.showPilgrimGate();
    });
    query('#startUmrahPov').addEventListener('click', () => this.startPilgrimJourney('umrah'));
    query('#startHajjPov').addEventListener('click', () => this.startPilgrimJourney('hajj'));
    query('#exploreMapBtn').addEventListener('click', () => {
      this.hidePilgrimGate();
      this.exitPilgrimMode();
    });
    query('#pilgrimContinueBtn').addEventListener('click', () => this.continuePilgrimJourney());
    query('#exitPilgrimBtn').addEventListener('click', () => this.exitPilgrimMode());
    queryAll('#guideTabs button').forEach((button) => {
      button.addEventListener('click', () => {
        this.journeyId = button.dataset.journey;
        this.stepIndex = 0;
        this.applyGuideStep();
      });
    });
    query('#guidePrev').addEventListener('click', () => {
      if (this.stepIndex <= 0) return;
      this.stepIndex -= 1;
      this.applyGuideStep();
    });
    query('#guideNext').addEventListener('click', () => {
      const steps = JOURNEYS[this.journeyId].steps;
      if (this.stepIndex >= steps.length - 1) {
        this.toast(UI[this.language].completed);
        return;
      }
      this.stepIndex += 1;
      this.applyGuideStep();
    });

    query('#langBtn').addEventListener('click', () => {
      this.language = this.language === 'en' ? 'gu' : 'en';
      this.setUI();
      this.build();
    });
    query('#resetBtn').addEventListener('click', () => this.resetView());
    query('#focusBtn').addEventListener('click', () => this.focusOn(this.selected));
    query('#listenBtn').addEventListener('click', () => this.speakSelected());
    query('#duaPlayBtn').addEventListener('click', () => this.playActiveDua());
    query('#completeBtn').addEventListener('click', () => this.toggleComplete());
    query('#walkBtn').addEventListener('click', () => this.setWalking(!this.walking));
    query('#walkExitBtn').addEventListener('click', () => this.setWalking(false));

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
      if (this.walking) this.setWalking(false);
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
    const back = this.mode === 'hajj' ? 16 : 7.5;
    const height = this.mode === 'hajj' ? 12 : 5.2;
    const lateral = this.mode === 'hajj' ? 6 : 2.8;
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
      if (!object.userData.pilgrim || object.parent !== this.root) return;
      const angle = (time * 0.00012 + object.userData.t) * Math.PI * 2;
      const radius = 11 + (object.userData.t % 4) * 2.4;
      object.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
      object.rotation.y = -angle + Math.PI / 2;
    });
  }

  loop(time) {
    requestAnimationFrame((nextTime) => this.loop(nextTime));
    const delta = Math.min(50, time - this.lastFrameTime || 16.67);
    this.lastFrameTime = time;

    if (!this.playing && !this.walking && !this.controls.enabled) this.controls.enabled = true;
    if (this.playing && this.routeCurve) {
      this.routeTime = (this.routeTime + 0.00065 * (delta / 16.67)) % 1;
      query('#routeSlider').value = String(Math.round(this.routeTime * 1000));
    }

    this.updateWalk(delta);
    this.updateRouteCamera();
    if ((!this.playing || !this.followRoute) && !this.walking) this.controls.update();
    this.updatePilgrims(time);
    this.renderer.render(this.scene, this.camera);
  }
}
