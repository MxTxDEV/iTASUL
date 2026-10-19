/* =========================================================
   GRUPO ITASUL — Betoneira 400L em 3D (three.js)
   Modelo feito em código a partir das fotos da betoneira 400L: tambor
   amarelo com faixa preta, garfo basculante, cavaletes em "A", caixa do
   motor verde, volante, pés com sapata e rodas.
   ========================================================= */
import * as THREE from "three";
import { OrbitControls } from "three/addons/OrbitControls.js";
import { RoomEnvironment } from "three/addons/RoomEnvironment.js";

/* ▼▼▼ CORES DA BETONEIRA — ajuste aqui para ficar igual à sua máquina ▼▼▼ */
const COLORS = {
  drum: "#f5b800",     // tambor (amarelo)
  frame: "#f2ae00",    // cavaletes, viga e garfo (amarelo)
  band: "#17140f",     // faixa preta / cremalheira
  box: "#0c7a57",      // caixa do motor (verde)
  tire: "#161616",     // pneus
  rim: "#2c2f31",      // aros das rodas
  metal: "#9aa0a6",    // eixos e parafusos
};
const DECAL = { brand: "ITASUL", sub: "GRUPO", capacity: "400L" }; // textos do tambor e da caixa
/* ▲▲▲ -------------------------------------------------------------- ▲▲▲ */

const MIX_TILT = THREE.MathUtils.degToRad(-20);  // posição de mistura (boca levemente para trás)
const POUR_TILT = THREE.MathUtils.degToRad(105); // posição de despejo (boca para a frente)
const DRUM_SPEED = (27 * Math.PI * 2) / 60;      // 27 RPM, como a máquina real

export function initBetoneira(container) {
  const canvasWrap = container.querySelector(".b3d__canvas");
  const status = container.querySelector(".b3d__status");

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  } catch (e) {
    status.textContent = "Seu navegador não suporta visualização 3D.";
    container.classList.add("no-3d");
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.NeutralToneMapping; // preserva o amarelo e o verde saturados
  renderer.toneMappingExposure = 0.95;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  canvasWrap.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.55;

  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
  camera.position.set(-2.2, 1.7, 4.0);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0.68, 0);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = false;
  controls.minDistance = 2.0;
  controls.maxDistance = 7;
  controls.maxPolarAngle = THREE.MathUtils.degToRad(88);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  controls.autoRotate = !reduceMotion;
  controls.autoRotateSpeed = 1.5;

  /* ---------- Luzes de estúdio e chão ---------- */
  scene.add(new THREE.HemisphereLight(0xffffff, 0x3a3a3a, 0.35));
  const key = new THREE.DirectionalLight(0xffffff, 2.6);
  key.position.set(-3, 6, 4);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -2, right: 2, top: 2, bottom: -2, near: 1, far: 15 });
  key.shadow.bias = -0.0004;
  key.shadow.radius = 4;
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xfff3dd, 0.7);
  fill.position.set(4, 2.5, 3);
  scene.add(fill);
  const rimLight = new THREE.DirectionalLight(0xff5a6a, 0.9);
  rimLight.position.set(0, 3, -5);
  scene.add(rimLight);

  const ground = new THREE.Mesh(new THREE.CircleGeometry(4, 64), new THREE.ShadowMaterial({ opacity: 0.38 }));
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  /* ---------- Materiais ---------- */
  const paint = (c, rough = 0.38) =>
    new THREE.MeshPhysicalMaterial({ color: c, metalness: 0.05, roughness: rough, clearcoat: 0.35, clearcoatRoughness: 0.35 });
  const M = {
    drum: paint(COLORS.drum, 0.34),
    drumInside: new THREE.MeshStandardMaterial({ color: COLORS.drum, roughness: 0.6, metalness: 0.1, side: THREE.BackSide }),
    frame: paint(COLORS.frame, 0.42),
    band: new THREE.MeshPhysicalMaterial({ color: COLORS.band, metalness: 0.2, roughness: 0.45, clearcoat: 0.3 }),
    box: paint(COLORS.box, 0.4),
    tire: new THREE.MeshStandardMaterial({ color: COLORS.tire, roughness: 0.92 }),
    rim: new THREE.MeshStandardMaterial({ color: COLORS.rim, metalness: 0.4, roughness: 0.5 }),
    metal: new THREE.MeshStandardMaterial({ color: COLORS.metal, metalness: 0.95, roughness: 0.28 }),
    red: new THREE.MeshStandardMaterial({ color: 0xd7261e, roughness: 0.35 }),
    black: new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.6 }),
  };

  const shadowed = (m) => { m.castShadow = true; m.receiveShadow = true; return m; };
  const mesh = (geo, mat) => shadowed(new THREE.Mesh(geo, mat));
  const UP = new THREE.Vector3(0, 1, 0);
  /** Tubo quadrado (perfil de aço) entre dois pontos */
  function bar(a, b, w, mat = M.frame, d = w) {
    const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b);
    const m = mesh(new THREE.BoxGeometry(w, A.distanceTo(B), d), mat);
    m.position.copy(A).add(B).multiplyScalar(0.5);
    m.quaternion.setFromUnitVectors(UP, B.clone().sub(A).normalize());
    return m;
  }
  /** Eixo redondo entre dois pontos */
  function rod(a, b, r, mat = M.metal) {
    const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b);
    const m = mesh(new THREE.CylinderGeometry(r, r, A.distanceTo(B), 20), mat);
    m.position.copy(A).add(B).multiplyScalar(0.5);
    m.quaternion.setFromUnitVectors(UP, B.clone().sub(A).normalize());
    return m;
  }
  /** Textura desenhada em canvas (adesivos e etiquetas) */
  function canvasTexture(w, h, draw) {
    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    draw(c.getContext("2d"), w, h);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    return tex;
  }

  const machine = new THREE.Group();
  scene.add(machine);

  /* =======================================================
     MEDIDAS (metros) — eixo X: lado do volante (−) ao lado do motor (+)
     ======================================================= */
  const PIVOT_Y = 0.98;   // altura do eixo basculante
  const END_X = 0.66;     // posição dos cavaletes
  const LEG_Z = 0.36;     // abertura das pernas do cavalete
  const BEAM_Y = 0.3;     // viga longitudinal
  const WHEEL_R = 0.17;
  const P = 0.055;        // seção do perfil de aço

  /* ---------- Cavaletes em "A" nas duas pontas ---------- */
  function trestle(x, bottomY) {
    const g = new THREE.Group();
    for (const s of [-1, 1]) g.add(bar([x, PIVOT_Y - 0.05, 0.02 * s], [x, bottomY, LEG_Z * s], P));
    g.add(bar([x, BEAM_Y, -LEG_Z * 0.72], [x, BEAM_Y, LEG_Z * 0.72], P)); // travessa
    g.add(bar([x, BEAM_Y, 0], [x, PIVOT_Y - 0.06, 0], P * 1.1));         // coluna central
    // mancal do eixo basculante
    const bearing = mesh(new THREE.BoxGeometry(0.11, 0.12, 0.14), M.frame);
    bearing.position.set(x, PIVOT_Y - 0.02, 0);
    g.add(bearing);
    const cap = mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.13, 20), M.metal);
    cap.rotation.z = Math.PI / 2;
    cap.position.set(x, PIVOT_Y, 0);
    g.add(cap);
    return g;
  }
  machine.add(trestle(-END_X, 0.02));
  machine.add(trestle(END_X, WHEEL_R));

  // pés com sapata (lado do volante)
  for (const s of [-1, 1]) {
    const plate = mesh(new THREE.BoxGeometry(0.14, 0.02, 0.12), M.frame);
    plate.position.set(-END_X, 0.01, LEG_Z * s);
    machine.add(plate);
  }
  // alça para erguer e empurrar (lado dos pés)
  machine.add(bar([-END_X, 0.22, 0], [-END_X - 0.14, 0.2, 0], 0.03));
  machine.add(bar([-END_X - 0.14, 0.2, -0.08], [-END_X - 0.14, 0.2, 0.08], 0.03));

  // viga longitudinal + mãos-francesas
  machine.add(bar([-END_X, BEAM_Y, 0], [END_X, BEAM_Y, 0], P * 1.25));
  for (const s of [-1, 1]) machine.add(bar([s * (END_X - 0.22), BEAM_Y, 0], [s * END_X, BEAM_Y + 0.2, 0], P * 0.8));

  // eixo basculante
  machine.add(rod([-END_X - 0.2, PIVOT_Y, 0], [END_X + 0.06, PIVOT_Y, 0], 0.028));

  /* ---------- Rodas (lado do motor) ---------- */
  function wheel(z) {
    const g = new THREE.Group();
    const tire = mesh(new THREE.TorusGeometry(WHEEL_R - 0.045, 0.045, 20, 48), M.tire);
    tire.scale.z = 1.35;
    g.add(tire);
    const rimDisc = mesh(new THREE.CylinderGeometry(WHEEL_R - 0.05, WHEEL_R - 0.05, 0.07, 36), M.rim);
    rimDisc.rotation.x = Math.PI / 2;
    g.add(rimDisc);
    // nervuras radiais do aro
    const ribs = new THREE.InstancedMesh(new THREE.BoxGeometry(0.008, WHEEL_R - 0.09, 0.085), M.rim, 16);
    const d = new THREE.Object3D();
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      d.position.set(Math.sin(a) * (WHEEL_R - 0.03) / 2 + Math.sin(a) * 0.02, Math.cos(a) * (WHEEL_R - 0.03) / 2 + Math.cos(a) * 0.02, 0);
      d.rotation.set(0, 0, -a);
      d.updateMatrix();
      ribs.setMatrixAt(i, d.matrix);
    }
    ribs.castShadow = true;
    g.add(ribs);
    const hub = mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.11, 20), M.metal);
    hub.rotation.x = Math.PI / 2;
    g.add(hub);
    g.position.set(END_X + 0.04, WHEEL_R, z);
    return g;
  }
  const WHEEL_Z = LEG_Z + 0.07;
  machine.add(wheel(WHEEL_Z), wheel(-WHEEL_Z));
  machine.add(rod([END_X + 0.04, WHEEL_R, -WHEEL_Z - 0.05], [END_X + 0.04, WHEEL_R, WHEEL_Z + 0.05], 0.018));

  /* ---------- Caixa do motor (verde) ---------- */
  const BOX = { x0: END_X + 0.03, w: 0.3, y0: 0.44, h: 0.6, d: 0.46 };
  {
    // perfil lateral com o chanfro em cima na frente
    const sh = new THREE.Shape();
    const zf = BOX.d / 2, zb = -BOX.d / 2;
    sh.moveTo(zb, 0);
    sh.lineTo(zf, 0);
    sh.lineTo(zf, BOX.h * 0.78);
    sh.lineTo(zf - 0.12, BOX.h);
    sh.lineTo(zb, BOX.h);
    sh.closePath();
    const geo = new THREE.ExtrudeGeometry(sh, { depth: BOX.w, bevelEnabled: true, bevelSize: 0.008, bevelThickness: 0.008, bevelSegments: 3 });
    const box = mesh(geo, M.box);
    // extrude em +Z -> gira para extrudar em +X
    box.rotation.y = Math.PI / 2;
    box.position.set(BOX.x0, BOX.y0, 0);
    machine.add(box);

    // painel frontal: etiqueta 400L, adesivos e ventilação
    const front = canvasTexture(512, 768, (ctx, w, h) => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#0b0b0b";
      ctx.font = "italic 900 92px Arial Black, Arial, sans-serif";
      ctx.fillText(DECAL.brand, 36, 150);
      ctx.fillRect(36, 168, 330, 10);
      ctx.font = "900 150px Arial Black, Arial, sans-serif";
      ctx.fillText(DECAL.capacity, 30, 330);
      ctx.font = "600 34px Arial, sans-serif";
      ctx.fillText("Betoneira Profissional", 38, 385);
      // adesivo de segurança
      ctx.fillStyle = "#f4f4f4";
      ctx.fillRect(300, 470, 170, 120);
      ctx.fillStyle = "#c8102e";
      ctx.fillRect(300, 470, 170, 26);
      ctx.fillStyle = "#333";
      for (let i = 0; i < 5; i++) ctx.fillRect(312, 510 + i * 15, 146 - (i % 2) * 40, 7);
      // grade de ventilação
      ctx.fillStyle = "rgba(0,0,0,.55)";
      for (let i = 0; i < 5; i++) {
        ctx.save();
        ctx.translate(200 + i * 22, 640);
        ctx.rotate(-0.6);
        ctx.fillRect(0, 0, 70, 9);
        ctx.restore();
      }
    });
    const faceH = BOX.h * 0.78;
    const frontPlane = new THREE.Mesh(new THREE.PlaneGeometry(BOX.w - 0.02, faceH - 0.02), new THREE.MeshStandardMaterial({ map: front, transparent: true, roughness: 0.5 }));
    frontPlane.position.set(BOX.x0 + BOX.w / 2, BOX.y0 + faceH / 2, BOX.d / 2 + 0.0095);
    machine.add(frontPlane);
    // botão liga/desliga vermelho e botão verde
    const btnRed = mesh(new THREE.CylinderGeometry(0.022, 0.024, 0.025, 24), M.red);
    btnRed.rotation.x = Math.PI / 2;
    btnRed.position.set(BOX.x0 + 0.13, BOX.y0 + 0.2, BOX.d / 2 + 0.02);
    machine.add(btnRed);
    const btnBase = mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.008, 24), M.black);
    btnBase.rotation.x = Math.PI / 2;
    btnBase.position.set(BOX.x0 + 0.13, BOX.y0 + 0.2, BOX.d / 2 + 0.012);
    machine.add(btnBase);
    const btnSmall = mesh(new THREE.BoxGeometry(0.03, 0.045, 0.012), new THREE.MeshStandardMaterial({ color: 0xe8e8e8, roughness: 0.4 }));
    btnSmall.position.set(BOX.x0 + 0.06, BOX.y0 + 0.2, BOX.d / 2 + 0.014);
    machine.add(btnSmall);

    // lateral externa com ventilação
    const side = canvasTexture(512, 512, (ctx, w, h) => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "rgba(0,0,0,.5)";
      for (let i = 0; i < 6; i++) ctx.fillRect(120 + i * 48, 330, 22, 110);
      for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(80 + i * 120, 60, 9, 0, 7); ctx.fill(); }
    });
    const sidePlane = new THREE.Mesh(new THREE.PlaneGeometry(BOX.d - 0.04, BOX.h * 0.75), new THREE.MeshStandardMaterial({ map: side, transparent: true }));
    sidePlane.rotation.y = Math.PI / 2;
    sidePlane.position.set(BOX.x0 + BOX.w + 0.0095, BOX.y0 + BOX.h * 0.4, 0);
    machine.add(sidePlane);

    // suporte da caixa na coluna
    machine.add(bar([END_X, BOX.y0 - 0.02, -0.15], [END_X + 0.3, BOX.y0 - 0.02, -0.15], 0.04));
    machine.add(bar([END_X, BOX.y0 - 0.02, 0.15], [END_X + 0.3, BOX.y0 - 0.02, 0.15], 0.04));

    // cabo de energia saindo da caixa até o chão
    const cable = new THREE.CatmullRomCurve3([
      new THREE.Vector3(BOX.x0 + 0.22, BOX.y0 + 0.02, BOX.d / 2 - 0.05),
      new THREE.Vector3(BOX.x0 + 0.3, BOX.y0 - 0.15, BOX.d / 2 + 0.05),
      new THREE.Vector3(BOX.x0 + 0.42, 0.06, BOX.d / 2 + 0.2),
      new THREE.Vector3(BOX.x0 + 0.75, 0.012, BOX.d / 2 + 0.3),
    ]);
    machine.add(mesh(new THREE.TubeGeometry(cable, 48, 0.011, 10, false), M.black));
  }
  // eixo de transmissão saindo da caixa até o pinhão
  machine.add(rod([END_X + 0.03, PIVOT_Y - 0.2, -0.05], [0.5, PIVOT_Y - 0.2, -0.05], 0.02));

  /* ---------- Volante de basculamento (lado dos pés) ---------- */
  const handwheel = new THREE.Group();
  {
    const HR = 0.25;
    handwheel.add(mesh(new THREE.TorusGeometry(HR, 0.018, 14, 64), M.frame));
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 + 0.25;
      const spoke = mesh(new THREE.CylinderGeometry(0.011, 0.014, HR, 10), M.frame);
      spoke.position.set(Math.cos(a) * HR / 2, Math.sin(a) * HR / 2, 0);
      spoke.rotation.z = a - Math.PI / 2;
      handwheel.add(spoke);
    }
    const hub = mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.07, 24), M.frame);
    hub.rotation.x = Math.PI / 2;
    handwheel.add(hub);
    const nut = mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.09, 6), M.metal);
    nut.rotation.x = Math.PI / 2;
    handwheel.add(nut);
    // manopla
    const grip = mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.1, 12), M.frame);
    grip.rotation.x = Math.PI / 2;
    grip.position.set(HR * Math.cos(0.25), HR * Math.sin(0.25), 0.05);
    handwheel.add(grip);
  }
  const handwheelPivot = new THREE.Group();
  handwheelPivot.rotation.y = -Math.PI / 2;
  handwheelPivot.position.set(-END_X - 0.17, PIVOT_Y, 0);
  handwheelPivot.add(handwheel);
  machine.add(handwheelPivot);
  // disco de trava e alavanca
  const lockDisc = mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.014, 40), M.frame);
  lockDisc.rotation.z = Math.PI / 2;
  lockDisc.position.set(-END_X - 0.08, PIVOT_Y, 0);
  machine.add(lockDisc);
  machine.add(bar([-END_X - 0.08, PIVOT_Y - 0.1, 0.04], [-END_X - 0.08, PIVOT_Y - 0.3, 0.12], 0.02));

  /* =======================================================
     GRUPO BASCULANTE: garfo curvo + tambor
     ======================================================= */
  const tilt = new THREE.Group();
  tilt.position.set(0, PIVOT_Y, 0);
  tilt.rotation.x = MIX_TILT;
  machine.add(tilt);

  // garfo em "U" curvo passando por baixo do tambor
  {
    const YX = END_X - 0.1;
    const path = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-YX, 0, 0),
      new THREE.Vector3(-YX + 0.02, -0.22, 0),
      new THREE.Vector3(-0.42, -0.5, 0),
      new THREE.Vector3(-0.15, -0.6, 0),
      new THREE.Vector3(0.15, -0.6, 0),
      new THREE.Vector3(0.42, -0.5, 0),
      new THREE.Vector3(YX - 0.02, -0.22, 0),
      new THREE.Vector3(YX, 0, 0),
    ]);
    const sect = new THREE.Shape();
    sect.moveTo(-0.035, -0.02); sect.lineTo(0.035, -0.02); sect.lineTo(0.035, 0.02); sect.lineTo(-0.035, 0.02); sect.closePath();
    tilt.add(mesh(new THREE.ExtrudeGeometry(sect, { steps: 80, bevelEnabled: false, extrudePath: path }), M.frame));
    for (const s of [-1, 1]) {
      const boss = mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.12, 24), M.frame);
      boss.rotation.z = Math.PI / 2;
      boss.position.set(s * (YX + 0.02), 0, 0);
      tilt.add(boss);
      tilt.add(rod([s * (YX - 0.02), 0, 0], [s * (END_X - 0.05), 0, 0], 0.03, M.metal));
    }
    // mancal inferior (eixo do tambor)
    const lower = mesh(new THREE.CylinderGeometry(0.06, 0.075, 0.07, 24), M.frame);
    lower.position.y = -0.585;
    tilt.add(lower);
    // pinhão que engrena na cremalheira
    const pinion = mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.06, 16), M.metal);
    pinion.position.set(0.47, -0.2, -0.05);
    tilt.add(pinion);
  }

  /* ---------- Tambor ---------- */
  const drum = new THREE.Group();
  tilt.add(drum);
  // perfil: fundo arredondado, faixa no meio, cone até a boca
  const profile = [
    [0.0, -0.53], [0.1, -0.53], [0.2, -0.515], [0.29, -0.48], [0.36, -0.42], [0.41, -0.34],
    [0.445, -0.25], [0.462, -0.17], [0.47, -0.08], [0.47, 0.06], [0.462, 0.11],
    [0.43, 0.2], [0.395, 0.3], [0.395, 0.305], [0.36, 0.39], [0.32, 0.48], [0.295, 0.54], [0.29, 0.56],
  ].map(([r, y]) => new THREE.Vector2(r, y));
  drum.add(mesh(new THREE.LatheGeometry(profile, 128), M.drum));
  drum.add(new THREE.Mesh(new THREE.LatheGeometry(profile.map((p) => new THREE.Vector2(Math.max(p.x - 0.01, 0), p.y)), 128), M.drumInside));
  // borda da boca
  const lip = mesh(new THREE.TorusGeometry(0.29, 0.014, 14, 96), M.drum);
  lip.rotation.x = Math.PI / 2;
  lip.position.y = 0.56;
  drum.add(lip);
  // vinco do cone e vinco do fundo
  for (const [r, y] of [[0.397, 0.302], [0.446, -0.25]]) {
    const crease = mesh(new THREE.TorusGeometry(r, 0.006, 8, 128), M.drum);
    crease.rotation.x = Math.PI / 2;
    crease.position.y = y;
    drum.add(crease);
  }
  // faixa preta (cobertura da cremalheira) com junta de fixação
  const bandProfile = [[0.468, -0.085], [0.5, -0.082], [0.512, -0.065], [0.512, 0.065], [0.5, 0.082], [0.468, 0.085]]
    .map(([r, y]) => new THREE.Vector2(r, y));
  drum.add(mesh(new THREE.LatheGeometry(bandProfile, 128), M.band));
  {
    const joint = mesh(new THREE.BoxGeometry(0.035, 0.17, 0.03), M.band);
    joint.position.set(0.515, 0, 0);
    drum.add(joint);
    for (const y of [-0.05, 0.05]) {
      const bolt = mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.06, 8), M.metal);
      bolt.rotation.z = Math.PI / 2;
      bolt.position.set(0.53, y, 0);
      drum.add(bolt);
    }
  }
  // fundo com cubo central
  const bottomHub = mesh(new THREE.CylinderGeometry(0.05, 0.08, 0.04, 24), M.drum);
  bottomHub.position.y = -0.545;
  drum.add(bottomHub);
  // pás internas + eixo central (vistas pela boca)
  {
    const axle = mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.5, 12), M.metal);
    axle.position.y = -0.25;
    drum.add(axle);
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * Math.PI * 2;
      const blade = mesh(new THREE.BoxGeometry(0.34, 0.03, 0.12), M.drum);
      blade.position.set(Math.cos(a) * 0.2, -0.38 + i * 0.12, Math.sin(a) * 0.2);
      blade.rotation.set(0.5, -a, 0);
      drum.add(blade);
    }
  }
  // logotipo no cone (adesivo)
  {
    const logo = canvasTexture(1024, 320, (ctx, w, h) => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#111";
      ctx.textAlign = "center";
      ctx.font = "italic 900 205px Arial Black, Arial, sans-serif";
      ctx.fillText(DECAL.brand, w / 2, 205);
      // traço curvo abaixo do nome
      ctx.beginPath();
      ctx.moveTo(w / 2 - 420, 236); ctx.quadraticCurveTo(w / 2, 214, w / 2 + 430, 240);
      ctx.lineTo(w / 2 + 430, 262); ctx.quadraticCurveTo(w / 2, 236, w / 2 - 420, 258);
      ctx.fill();
      ctx.font = "800 40px Arial, sans-serif";
      ctx.fillText(DECAL.sub + " · LOCAÇÕES", w / 2 + 250, 305);
    });
    const seg = profile.filter((p) => p.y >= 0.11 && p.y <= 0.49).map((p) => new THREE.Vector2(p.x + 0.003, p.y));
    const decalGeo = new THREE.LatheGeometry(seg, 64, -1.05, 2.1); // centrado na frente (+Z)
    const decal = new THREE.Mesh(decalGeo, new THREE.MeshPhysicalMaterial({ map: logo, transparent: true, roughness: 0.35, clearcoat: 0.5, polygonOffset: true, polygonOffsetFactor: -2 }));
    drum.add(decal);
  }

  // centraliza o conjunto
  machine.position.set(-0.05, 0, 0);

  /* ---------- Controles da interface ---------- */
  let spinning = !reduceMotion;
  let tiltTarget = MIX_TILT;
  let idleTimer;
  const btn = (name) => container.querySelector(`[data-b3d="${name}"]`);
  const is3d = () => !container.classList.contains("show-photos");

  const pauseAuto = () => {
    container.classList.add("is-used");
    controls.autoRotate = false;
    btn("auto")?.classList.remove("active");
    clearTimeout(idleTimer);
  };
  controls.addEventListener("start", pauseAuto);

  btn("auto")?.addEventListener("click", (e) => {
    if (!is3d()) return;
    controls.autoRotate = !controls.autoRotate;
    e.currentTarget.classList.toggle("active", controls.autoRotate);
  });
  container.addEventListener("b3d:mode", () => is3d() && btn("auto")?.classList.toggle("active", controls.autoRotate));
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
      if (!is3d() || !views[b.dataset.view]) return;
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
    if (!visible || !is3d()) return;
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
  container.classList.add("is-ready-3d");
  status.textContent = "";
}

/* ---------- Visualizador 360° com as fotos da betoneira ---------- */
function initPhotoSpin(container, onMode) {
  const base = container.dataset.photos;
  const frames = +container.dataset.frames || 12;
  const view = container.querySelector(".b3d__photos");
  const [imgA, imgB, extra] = view.querySelectorAll("img");
  const angleLabel = container.querySelector(".b3d__angle");
  const status = container.querySelector(".b3d__status");
  const autoBtn = container.querySelector('[data-b3d="auto"]');
  const step = 360 / frames;
  const src = (i) => `${base}${String(i + 1).padStart(2, "0")}.jpg`;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // pré-carrega todos os ângulos
  let loaded = 0;
  const imgs = Array.from({ length: frames }, (_, i) => {
    const im = new Image();
    im.onload = () => { if (++loaded === frames) { container.classList.add("is-ready"); status.textContent = ""; } };
    im.src = src(i);
    return im;
  });
  ["topo", "interior"].forEach((n) => (new Image().src = `${base}${n}.jpg`));

  let angle = 0, auto = !reduceMotion, dragging = false, lastX = 0, velocity = 0, idle;
  const photosActive = () => container.classList.contains("show-photos");

  function render() {
    const a = ((angle % 360) + 360) % 360;
    const f = Math.floor(a / step) % frames;
    const t = (a - f * step) / step;
    // transição suave entre o ângulo atual e o próximo
    if (imgA.dataset.f !== String(f)) { imgA.src = imgs[f].src; imgA.dataset.f = f; }
    const n = (f + 1) % frames;
    if (imgB.dataset.f !== String(n)) { imgB.src = imgs[n].src; imgB.dataset.f = n; }
    // cada ângulo fica nítido e a troca acontece rápido no meio do caminho
    const u = Math.min(1, Math.max(0, (t - 0.38) / 0.24));
    imgB.style.opacity = u * u * (3 - 2 * u);
    if (!view.classList.contains("show-extra")) angleLabel.textContent = `${Math.round(a)}°`;
  }

  function setAuto(on) {
    auto = on;
    if (photosActive()) autoBtn.classList.toggle("active", auto);
  }
  function showExtra(name) {
    extra.src = `${base}${name}.jpg`;
    view.classList.add("show-extra");
    angleLabel.textContent = name === "topo" ? "Vista de cima" : "Por dentro";
  }
  function hideExtra() { view.classList.remove("show-extra"); }

  let target = null;
  const VIEWS = { front: 0, side: 90, back: 180 };
  container.querySelectorAll("[data-view]").forEach((b) =>
    b.addEventListener("click", () => {
      if (!photosActive()) return;
      container.classList.add("is-used");
      setAuto(false);
      const v = b.dataset.view;
      if (v === "top") return showExtra("topo");
      if (v === "inside") return showExtra("interior");
      hideExtra();
      // vai pelo caminho mais curto até o ângulo escolhido
      const cur = ((angle % 360) + 360) % 360;
      let d = VIEWS[v] - cur;
      if (d > 180) d -= 360;
      if (d < -180) d += 360;
      target = angle + d;
    })
  );
  autoBtn.addEventListener("click", () => { if (photosActive()) { hideExtra(); setAuto(!auto); } });

  view.addEventListener("pointerdown", (e) => {
    dragging = true; lastX = e.clientX; velocity = 0; target = null;
    hideExtra(); setAuto(false); clearTimeout(idle);
    container.classList.add("is-used");
    view.setPointerCapture(e.pointerId);
  });
  view.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    lastX = e.clientX;
    angle -= dx * 0.6;
    velocity = -dx * 0.6;
  });
  const end = () => {
    if (!dragging) return;
    dragging = false;
    idle = setTimeout(() => !reduceMotion && setAuto(true), 6000); // volta a girar sozinha depois de um tempo
  };
  view.addEventListener("pointerup", end);
  view.addEventListener("pointercancel", end);

  let last = performance.now();
  (function loop(now) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    if (photosActive()) {
      if (target !== null) {
        angle += (target - angle) * Math.min(1, dt * 5);
        if (Math.abs(target - angle) < 0.2) { angle = target; target = null; }
      } else if (!dragging) {
        if (Math.abs(velocity) > 0.05) { angle += velocity; velocity *= 0.9; } // inércia ao soltar
        else if (auto) angle += 24 * dt;
      }
      render();
    }
    requestAnimationFrame(loop);
  })(last);

  // abas: Fotos 360° / Modelo 3D
  const tabs = container.querySelectorAll(".b3d__tabs button");
  tabs.forEach((b) =>
    b.addEventListener("click", () => {
      tabs.forEach((x) => x.classList.toggle("active", x === b));
      container.classList.toggle("show-photos", b.dataset.mode === "photos");
      if (b.dataset.mode === "photos") autoBtn.classList.toggle("active", auto);
      onMode(b.dataset.mode);
      container.dispatchEvent(new Event("b3d:mode"));
    })
  );
  setAuto(auto);
  render();
}

/* ---------- Inicia o visualizador; o 3D só carrega se a pessoa abrir a aba ---------- */
const el = document.querySelector("#betoneira3d");
if (el) {
  let started3d = false;
  initPhotoSpin(el, (mode) => {
    if (mode === "3d" && !started3d) {
      started3d = true;
      initBetoneira(el);
    }
  });
}
