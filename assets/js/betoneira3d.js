/* =========================================================
   GRUPO ITASUL — Betoneira 400L em 3D (three.js)
   Modelo feito em código: tambor, cremalheira, garfo basculante,
   motor com protetor de correia, volante, chassi, rodas e cambão.
   ========================================================= */
import * as THREE from "three";
import { OrbitControls } from "three/addons/OrbitControls.js";
import { RoomEnvironment } from "three/addons/RoomEnvironment.js";

/* ▼▼▼ CORES DA BETONEIRA — ajuste aqui para ficar igual à sua máquina ▼▼▼ */
const COLORS = {
  drum: "#c8102e",     // tambor
  frame: "#c8102e",    // chassi, garfo e colunas
  metal: "#3a3d42",    // cremalheira, eixos e peças de aço
  motor: "#2f3338",    // motor e protetor da correia
  tire: "#151515",     // pneus
  rim: "#b9bcc0",      // aros das rodas
  inside: "#6f6a64",   // interior do tambor (concreto)
};
/* ▲▲▲ -------------------------------------------------------------- ▲▲▲ */

const MIX_TILT = THREE.MathUtils.degToRad(32);   // posição de mistura
const POUR_TILT = THREE.MathUtils.degToRad(118); // posição de despejo
const DRUM_SPEED = (27 * Math.PI * 2) / 60;      // 27 RPM, como a máquina real

export function initBetoneira(container) {
  const canvasWrap = container.querySelector(".b3d__canvas");
  const status = container.querySelector(".b3d__status");

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  } catch (e) {
    status.textContent = "Seu navegador não suporta visualização 3D.";
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  canvasWrap.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
  camera.position.set(3.4, 1.9, 3.6);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0.64, 0.05);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = false;
  controls.minDistance = 2.2;
  controls.maxDistance = 7;
  controls.maxPolarAngle = THREE.MathUtils.degToRad(86);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  controls.autoRotate = !reduceMotion;
  controls.autoRotateSpeed = 1.6;

  /* ---------- Luzes e chão ---------- */
  scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 0.6));
  const sun = new THREE.DirectionalLight(0xffffff, 2.2);
  sun.position.set(3, 6, 4);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -2.5, right: 2.5, top: 2.5, bottom: -2.5, near: 1, far: 15 });
  sun.shadow.bias = -0.0005;
  scene.add(sun);
  const rim = new THREE.DirectionalLight(0xff4a5f, 0.8);
  rim.position.set(-4, 2, -3);
  scene.add(rim);

  const ground = new THREE.Mesh(new THREE.CircleGeometry(4, 64), new THREE.ShadowMaterial({ opacity: 0.35 }));
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  /* ---------- Materiais ---------- */
  const paint = (c) => new THREE.MeshPhysicalMaterial({ color: c, metalness: 0.35, roughness: 0.32, clearcoat: 0.6, clearcoatRoughness: 0.25 });
  const M = {
    drum: paint(COLORS.drum),
    frame: paint(COLORS.frame),
    metal: new THREE.MeshStandardMaterial({ color: COLORS.metal, metalness: 0.85, roughness: 0.35 }),
    steel: new THREE.MeshStandardMaterial({ color: 0xd5d8dc, metalness: 1, roughness: 0.22 }),
    motor: new THREE.MeshStandardMaterial({ color: COLORS.motor, metalness: 0.5, roughness: 0.45 }),
    tire: new THREE.MeshStandardMaterial({ color: COLORS.tire, metalness: 0, roughness: 0.9 }),
    rim: new THREE.MeshStandardMaterial({ color: COLORS.rim, metalness: 0.9, roughness: 0.3 }),
    inside: new THREE.MeshStandardMaterial({ color: COLORS.inside, metalness: 0.1, roughness: 0.95, side: THREE.BackSide }),
    rubber: new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.7 }),
  };

  const shadowed = (mesh) => { mesh.castShadow = true; mesh.receiveShadow = true; return mesh; };
  const mesh = (geo, mat) => shadowed(new THREE.Mesh(geo, mat));
  const UP = new THREE.Vector3(0, 1, 0);

  /** Tubo redondo entre dois pontos */
  function tube(a, b, r, mat = M.frame) {
    const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b);
    const len = A.distanceTo(B);
    const m = mesh(new THREE.CylinderGeometry(r, r, len, 20), mat);
    m.position.copy(A).add(B).multiplyScalar(0.5);
    m.quaternion.setFromUnitVectors(UP, B.clone().sub(A).normalize());
    return m;
  }
  /** Perfil quadrado entre dois pontos */
  function bar(a, b, w, mat = M.frame) {
    const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b);
    const m = mesh(new THREE.BoxGeometry(w, A.distanceTo(B), w), mat);
    m.position.copy(A).add(B).multiplyScalar(0.5);
    m.quaternion.setFromUnitVectors(UP, B.clone().sub(A).normalize());
    return m;
  }

  const machine = new THREE.Group();
  scene.add(machine);

  /* ---------- Rodas e eixo ---------- */
  const WHEEL_X = 0.78, WHEEL_R = 0.3, WHEEL_Z = -0.32;
  function wheel(x) {
    const g = new THREE.Group();
    const tire = mesh(new THREE.TorusGeometry(WHEEL_R - 0.085, 0.085, 24, 48), M.tire);
    tire.rotation.y = Math.PI / 2;
    tire.scale.set(1, 1, 1.25);
    g.add(tire);
    // banda de rodagem
    const treads = new THREE.InstancedMesh(new THREE.BoxGeometry(0.15, 0.03, 0.035), M.tire, 40);
    const d = new THREE.Object3D();
    for (let i = 0; i < 40; i++) {
      const a = (i / 40) * Math.PI * 2;
      d.position.set(0, Math.cos(a) * (WHEEL_R - 0.004), Math.sin(a) * (WHEEL_R - 0.004));
      d.rotation.set(a, 0, 0);
      d.updateMatrix();
      treads.setMatrixAt(i, d.matrix);
    }
    treads.castShadow = true;
    g.add(treads);
    const rimDisc = mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.13, 32), M.rim);
    rimDisc.rotation.z = Math.PI / 2;
    g.add(rimDisc);
    const hub = mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.2, 20), M.steel);
    hub.rotation.z = Math.PI / 2;
    g.add(hub);
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      const nut = mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.16, 8), M.steel);
      nut.rotation.z = Math.PI / 2;
      nut.position.set(0, Math.cos(a) * 0.09, Math.sin(a) * 0.09);
      g.add(nut);
    }
    g.position.set(x, WHEEL_R, WHEEL_Z);
    return g;
  }
  machine.add(wheel(WHEEL_X), wheel(-WHEEL_X));
  machine.add(tube([-WHEEL_X, WHEEL_R, WHEEL_Z], [WHEEL_X, WHEEL_R, WHEEL_Z], 0.03, M.metal));

  /* ---------- Chassi ---------- */
  const RAIL_Y = 0.42, RAIL_X = 0.5;
  // longarinas
  machine.add(bar([-RAIL_X, RAIL_Y, -0.55], [-RAIL_X, RAIL_Y, 0.62], 0.07));
  machine.add(bar([RAIL_X, RAIL_Y, -0.55], [RAIL_X, RAIL_Y, 0.62], 0.07));
  // travessas
  for (const z of [-0.55, 0.0, 0.62]) machine.add(bar([-RAIL_X, RAIL_Y, z], [RAIL_X, RAIL_Y, z], 0.065));
  // suportes do eixo das rodas
  for (const x of [-RAIL_X, RAIL_X]) {
    machine.add(bar([x, RAIL_Y, WHEEL_Z - 0.12], [x * 1.5, WHEEL_R, WHEEL_Z], 0.06));
    machine.add(bar([x, RAIL_Y, WHEEL_Z + 0.12], [x * 1.5, WHEEL_R, WHEEL_Z], 0.06));
  }
  // cambão (barra de reboque) com olhal
  machine.add(tube([-RAIL_X, RAIL_Y, 0.62], [0, 0.46, 1.2], 0.035));
  machine.add(tube([RAIL_X, RAIL_Y, 0.62], [0, 0.46, 1.2], 0.035));
  const eye = mesh(new THREE.TorusGeometry(0.06, 0.018, 12, 24), M.metal);
  eye.rotation.x = Math.PI / 2;
  eye.position.set(0, 0.46, 1.28);
  machine.add(eye);
  // pé de apoio
  machine.add(tube([0, RAIL_Y, 0.62], [0, 0.03, 0.66], 0.035));
  const foot = mesh(new THREE.BoxGeometry(0.22, 0.03, 0.16), M.metal);
  foot.position.set(0, 0.015, 0.66);
  machine.add(foot);

  /* ---------- Colunas (cavaletes) que sustentam o eixo basculante ---------- */
  const PIVOT_Y = 1.02, PIVOT_X = 0.72;
  for (const s of [-1, 1]) {
    const x = PIVOT_X * s;
    machine.add(bar([RAIL_X * s, RAIL_Y, -0.42], [x, PIVOT_Y - 0.06, 0], 0.075));
    machine.add(bar([RAIL_X * s, RAIL_Y, 0.42], [x, PIVOT_Y - 0.06, 0], 0.075));
    machine.add(bar([RAIL_X * s, RAIL_Y + 0.2, -0.3], [RAIL_X * s, RAIL_Y + 0.2, 0.3], 0.05));
    // mancal
    const bearing = mesh(new THREE.BoxGeometry(0.12, 0.14, 0.16), M.metal);
    bearing.position.set(x, PIVOT_Y - 0.03, 0);
    machine.add(bearing);
  }
  // eixo basculante
  machine.add(tube([-PIVOT_X - 0.1, PIVOT_Y, 0], [PIVOT_X + 0.16, PIVOT_Y, 0], 0.032, M.steel));

  /* ---------- Volante de basculamento (lado direito) ---------- */
  const handwheel = new THREE.Group();
  const ring = mesh(new THREE.TorusGeometry(0.26, 0.02, 14, 56), M.metal);
  handwheel.add(ring);
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    handwheel.add(tube([0, 0, 0], [Math.cos(a) * 0.25, Math.sin(a) * 0.25, 0], 0.011, M.metal));
    const knob = mesh(new THREE.SphereGeometry(0.03, 12, 12), M.rubber);
    knob.position.set(Math.cos(a) * 0.28, Math.sin(a) * 0.28, 0);
    handwheel.add(knob);
  }
  const hwHub = mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.06, 20), M.steel);
  hwHub.rotation.x = Math.PI / 2;
  handwheel.add(hwHub);
  handwheel.rotation.y = Math.PI / 2;
  const handwheelPivot = new THREE.Group();
  handwheelPivot.position.set(PIVOT_X + 0.18, PIVOT_Y, 0);
  handwheelPivot.add(handwheel);
  machine.add(handwheelPivot);
  // disco de trava
  const lockDisc = mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.015, 40), M.metal);
  lockDisc.rotation.z = Math.PI / 2;
  lockDisc.position.set(PIVOT_X + 0.08, PIVOT_Y, 0);
  machine.add(lockDisc);

  /* ---------- Grupo basculante: garfo + motor + tambor ---------- */
  const tilt = new THREE.Group();
  tilt.position.set(0, PIVOT_Y, 0);
  tilt.rotation.x = MIX_TILT;
  machine.add(tilt);

  // garfo em "U"
  const YOKE_X = 0.64, YOKE_BOTTOM = -0.66;
  for (const s of [-1, 1]) tilt.add(bar([YOKE_X * s, 0.02, 0], [YOKE_X * s, YOKE_BOTTOM, 0], 0.08));
  tilt.add(bar([-YOKE_X, YOKE_BOTTOM, 0], [YOKE_X, YOKE_BOTTOM, 0], 0.09));
  for (const s of [-1, 1]) {
    const boss = mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.11, 24), M.metal);
    boss.rotation.z = Math.PI / 2;
    boss.position.set(YOKE_X * s, 0, 0);
    tilt.add(boss);
  }
  // mancal inferior do tambor
  const lowerHub = mesh(new THREE.CylinderGeometry(0.11, 0.13, 0.1, 28), M.metal);
  lowerHub.position.set(0, YOKE_BOTTOM + 0.08, 0);
  tilt.add(lowerHub);

  // motor + protetor da correia (preso no garfo, atrás)
  const motor = new THREE.Group();
  const body = mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.34, 32), M.motor);
  body.rotation.z = Math.PI / 2;
  motor.add(body);
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2;
    const fin = mesh(new THREE.BoxGeometry(0.3, 0.012, 0.03), M.motor);
    fin.position.set(0, Math.cos(a) * 0.125, Math.sin(a) * 0.125);
    fin.rotation.x = a;
    motor.add(fin);
  }
  const cap = mesh(new THREE.CylinderGeometry(0.11, 0.12, 0.05, 32), M.metal);
  cap.rotation.z = Math.PI / 2;
  cap.position.x = -0.19;
  motor.add(cap);
  const box = mesh(new THREE.BoxGeometry(0.1, 0.08, 0.1), M.motor);
  box.position.set(0.02, 0.15, 0);
  motor.add(box);
  const base = mesh(new THREE.BoxGeometry(0.3, 0.025, 0.24), M.metal);
  base.position.y = -0.125;
  motor.add(base);
  motor.position.set(0.18, YOKE_BOTTOM - 0.02, -0.4);
  tilt.add(motor);
  tilt.add(bar([0.02, YOKE_BOTTOM, -0.05], [0.02, YOKE_BOTTOM - 0.14, -0.4], 0.05));
  tilt.add(bar([0.34, YOKE_BOTTOM, -0.05], [0.34, YOKE_BOTTOM - 0.14, -0.4], 0.05));
  // protetor da correia: sobe do motor até o pinhão
  const guardShape = new THREE.Shape();
  guardShape.absarc(0, 0, 0.1, Math.PI / 2, (Math.PI * 3) / 2, false);
  guardShape.lineTo(0.55, -0.07);
  guardShape.absarc(0.55, 0, 0.07, -Math.PI / 2, Math.PI / 2, false);
  guardShape.lineTo(0, 0.1);
  const guard = mesh(new THREE.ExtrudeGeometry(guardShape, { depth: 0.06, bevelEnabled: true, bevelSize: 0.01, bevelThickness: 0.01, bevelSegments: 2 }), M.motor);
  guard.rotation.set(0, Math.PI / 2, Math.PI / 2);
  guard.position.set(0.37, YOKE_BOTTOM - 0.04, -0.42);
  tilt.add(guard);
  // eixo + pinhão que engrena na cremalheira
  tilt.add(tube([0.37, YOKE_BOTTOM + 0.5, -0.47], [0.37, YOKE_BOTTOM - 0.04, -0.47], 0.02, M.steel));
  const pinion = mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.07, 18), M.metal);
  pinion.position.set(0.37, -0.12, -0.47);
  tilt.add(pinion);
  tilt.add(bar([YOKE_X, -0.3, 0], [0.4, -0.3, -0.45], 0.05));

  /* ---------- Tambor (gira em torno do próprio eixo) ---------- */
  const drum = new THREE.Group();
  drum.position.y = 0.05;
  tilt.add(drum);
  const profile = [
    [0.0, -0.6], [0.2, -0.6], [0.33, -0.56], [0.43, -0.44], [0.49, -0.26],
    [0.5, -0.12], [0.5, 0.02], [0.48, 0.1], [0.4, 0.3], [0.32, 0.47], [0.27, 0.56], [0.265, 0.6],
  ].map(([r, y]) => new THREE.Vector2(r, y));
  const drumGeo = new THREE.LatheGeometry(profile, 96);
  drum.add(mesh(drumGeo, M.drum));
  const inner = mesh(new THREE.LatheGeometry(profile.map((p) => new THREE.Vector2(Math.max(p.x - 0.012, 0), p.y)), 96), M.inside);
  drum.add(inner);
  // boca reforçada
  const mouth = mesh(new THREE.TorusGeometry(0.265, 0.022, 16, 64), M.drum);
  mouth.rotation.x = Math.PI / 2;
  mouth.position.y = 0.6;
  drum.add(mouth);
  // frisos de reforço
  for (const [r, y] of [[0.502, -0.12], [0.488, 0.09], [0.36, 0.39]]) {
    const rib = mesh(new THREE.TorusGeometry(r, 0.014, 10, 96), M.drum);
    rib.rotation.x = Math.PI / 2;
    rib.position.y = y;
    drum.add(rib);
  }
  // cremalheira (coroa dentada)
  const crown = mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.075, 96, 1, true), M.metal);
  crown.position.y = -0.12;
  crown.material = M.metal.clone();
  crown.material.side = THREE.DoubleSide;
  drum.add(crown);
  const crownTop = mesh(new THREE.RingGeometry(0.49, 0.55, 96), crown.material);
  crownTop.rotation.x = -Math.PI / 2;
  crownTop.position.y = -0.0825;
  drum.add(crownTop);
  const TEETH = 90;
  const teeth = new THREE.InstancedMesh(new THREE.BoxGeometry(0.03, 0.075, 0.022), M.metal, TEETH);
  const t = new THREE.Object3D();
  for (let i = 0; i < TEETH; i++) {
    const a = (i / TEETH) * Math.PI * 2;
    t.position.set(Math.cos(a) * 0.562, -0.12, Math.sin(a) * 0.562);
    t.rotation.y = -a;
    t.updateMatrix();
    teeth.setMatrixAt(i, t.matrix);
  }
  teeth.castShadow = true;
  drum.add(teeth);
  // pás internas (aparecem pela boca)
  for (let i = 0; i < 3; i++) {
    const blade = mesh(new THREE.BoxGeometry(0.02, 0.62, 0.2), M.metal);
    const a = (i / 3) * Math.PI * 2;
    blade.position.set(Math.cos(a) * 0.3, -0.05, Math.sin(a) * 0.3);
    blade.rotation.set(0, -a, 0.35);
    drum.add(blade);
  }

  // centraliza o conjunto na frente da câmera
  machine.position.set(0, 0, -0.1);

  /* ---------- Controles da interface ---------- */
  let spinning = !reduceMotion;
  let tiltTarget = MIX_TILT;
  let idleTimer;
  const btn = (name) => container.querySelector(`[data-b3d="${name}"]`);

  const pauseAuto = () => {
    container.classList.add("is-used");
    controls.autoRotate = false;
    btn("auto")?.classList.remove("active");
    clearTimeout(idleTimer);
  };
  controls.addEventListener("start", pauseAuto);

  btn("auto")?.addEventListener("click", (e) => {
    controls.autoRotate = !controls.autoRotate;
    e.currentTarget.classList.toggle("active", controls.autoRotate);
  });
  btn("auto")?.classList.toggle("active", controls.autoRotate);

  btn("spin")?.addEventListener("click", (e) => {
    spinning = !spinning;
    e.currentTarget.classList.toggle("active", spinning);
  });
  btn("spin")?.classList.toggle("active", spinning);

  btn("pour")?.addEventListener("click", (e) => {
    const pouring = tiltTarget === MIX_TILT;
    tiltTarget = pouring ? POUR_TILT : MIX_TILT;
    e.currentTarget.classList.toggle("active", pouring);
    e.currentTarget.querySelector("span").textContent = pouring ? "Voltar" : "Despejar";
  });

  // vistas prontas: frente, lado, trás, cima
  const views = {
    front: [0, 1.15, 4.9],
    side: [4.9, 1.15, 0],
    back: [0, 1.15, -4.9],
    top: [0.01, 5.2, 0.6],
  };
  let camTween = null;
  container.querySelectorAll("[data-view]").forEach((b) =>
    b.addEventListener("click", () => {
      pauseAuto();
      camTween = { from: camera.position.clone(), to: new THREE.Vector3(...views[b.dataset.view]), t: 0 };
    })
  );

  /* ---------- Tamanho e renderização ---------- */
  function resize() {
    const { clientWidth: w, clientHeight: h } = canvasWrap;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // em telas estreitas afasta a câmera para caber a máquina inteira
    camera.fov = w / h < 0.9 ? 42 : 35;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(canvasWrap);
  resize();

  let visible = true;
  new IntersectionObserver(([entry]) => (visible = entry.isIntersecting)).observe(container);

  const clock = new THREE.Clock();
  renderer.setAnimationLoop(() => {
    const dt = Math.min(clock.getDelta(), 0.05);
    if (!visible) return;
    if (spinning) drum.rotation.y += DRUM_SPEED * dt;
    const before = tilt.rotation.x;
    tilt.rotation.x += (tiltTarget - tilt.rotation.x) * Math.min(1, dt * 2.2);
    handwheel.rotation.z -= (tilt.rotation.x - before) * 4; // volante gira ao bascular
    if (camTween) {
      camTween.t = Math.min(1, camTween.t + dt * 1.4);
      const k = 1 - Math.pow(1 - camTween.t, 3);
      camera.position.lerpVectors(camTween.from, camTween.to, k);
      if (camTween.t === 1) camTween = null;
    }
    controls.update(dt);
    renderer.render(scene, camera);
  });

  if (window.matchMedia("(pointer: coarse)").matches) {
    const hint = container.querySelector(".b3d__hint");
    if (hint) hint.lastChild.textContent = "Arraste para girar · Pince para aproximar";
  }
  container.classList.add("is-ready");
  status.textContent = "";
}

/* ---------- Visualizador 360° com fotos reais (fica ativo quando as fotos existirem) ---------- */
function initPhotoSpin(container) {
  const base = container.dataset.photos;
  const frames = +container.dataset.frames || 36;
  if (!base) return;
  const src = (i) => `${base}${String(i + 1).padStart(2, "0")}.jpg`;
  const probe = new Image();
  probe.onload = () => {
    const tabs = container.querySelector(".b3d__tabs");
    const view = container.querySelector(".b3d__photos");
    const img = view.querySelector("img");
    tabs.hidden = false;
    const imgs = Array.from({ length: frames }, (_, i) => { const im = new Image(); im.src = src(i); return im; });
    let frame = 0, startX = 0, startFrame = 0, dragging = false;
    const show = (f) => { frame = ((f % frames) + frames) % frames; img.src = imgs[frame].src; };
    show(0);
    view.addEventListener("pointerdown", (e) => { dragging = true; startX = e.clientX; startFrame = frame; view.setPointerCapture(e.pointerId); });
    view.addEventListener("pointermove", (e) => { if (dragging) show(startFrame - Math.round((e.clientX - startX) / 12)); });
    view.addEventListener("pointerup", () => (dragging = false));
    tabs.querySelectorAll("button").forEach((b) =>
      b.addEventListener("click", () => {
        tabs.querySelectorAll("button").forEach((x) => x.classList.toggle("active", x === b));
        container.classList.toggle("show-photos", b.dataset.mode === "photos");
      })
    );
  };
  probe.src = src(0);
}

/* ---------- Só carrega o 3D quando a seção chega perto da tela ---------- */
const el = document.querySelector("#betoneira3d");
if (el) {
  initPhotoSpin(el);
  const io = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      initBetoneira(el);
    },
    { rootMargin: "300px" }
  );
  io.observe(el);
}
