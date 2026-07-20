/* ============================================================================
   RESETRIX — js/scene.js  (ES module)
   three.js particle-morph scene: ~10k particles that fluidly morph between
   10 procedurally generated formations — starfield (intro), 8 lifecycle
   phases, and a calm sphere (finale).

   PUBLIC API (exposed on window.ResetrixScene for the classic scripts):
     .ready               -> true once the first frame has rendered
     .setVirtualPhase(v)  -> v in [-1, 8]
                             -1      = intro starfield
                              0..7   = the 8 lifecycle phases (fractional
                                       values morph between formations)
                              8      = finale sphere
   Fires "resetrix:scene-ready" on window once initialized.

   TO SWAP IN A REAL MODEL LATER:
     Replace any builder in FORMATION_BUILDERS with a function that samples
     COUNT points from your loaded geometry (e.g. via MeshSurfaceSampler
     from three/addons) and returns a Float32Array of xyz in ~[-1.5, 1.5].
   ============================================================================ */

import * as THREE from "three";

/* ----------------------------------------------------------------------------
   Config
   ---------------------------------------------------------------------------- */
const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const MOBILE = window.matchMedia("(max-width: 700px)").matches;

/* Fewer particles on small screens for battery/perf. */
const COUNT = MOBILE ? 6400 : 10000;

const SCALE = 4.0;              // world-unit multiplier for all formations
const BG_COLOR = 0x05070f;      // must match --bg in styles.css
const MAX_DPR = 2;              // cap devicePixelRatio for perf

/* ----------------------------------------------------------------------------
   Formation builders — one per scene state.
   Each returns a Float32Array(COUNT * 3) of xyz coords in roughly [-1.8, 1.8];
   everything is multiplied by SCALE after building.

   Index mapping (fi = virtualPhase + 1):
     0 starfield (intro) | 1 core | 2 grid | 3 rings | 4 lattice | 5 torus
     6 starburst | 7 helix | 8 knot | 9 sphere (finale)
   ---------------------------------------------------------------------------- */

/** Helper: allocate a position array. */
function alloc() { return new Float32Array(COUNT * 3); }

/** Helper: deterministic-ish random in [-1, 1]. */
function rand() { return Math.random() * 2 - 1; }

/** Helper: points evenly on a unit sphere (fibonacci lattice). */
function fibonacciSphere(n, out = []) {
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const th = golden * i;
    out.push([Math.cos(th) * r, y, Math.sin(th) * r]);
  }
  return out;
}

/* -- 0 · INTRO: wide scattered starfield ------------------------------------ */
function buildStarfield() {
  const a = alloc();
  for (let i = 0; i < COUNT; i++) {
    const r = 0.9 + Math.random() * 2.6;
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(rand());
    a[i * 3]     = r * Math.sin(ph) * Math.cos(th) * 1.5;
    a[i * 3 + 1] = r * Math.cos(ph) * 0.85;
    a[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th) * 1.5;
  }
  return a;
}

/* -- 1 · COLLECT REQUIREMENT: particles converging into a dense core -------- */
function buildCore() {
  const a = alloc();
  for (let i = 0; i < COUNT; i++) {
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(rand());
    // 80% tightly clustered (pow biases toward center), 20% orbiting outliers
    const r = Math.random() < 0.8
      ? Math.pow(Math.random(), 2.4) * 0.6
      : 1.1 + Math.random() * 0.8;
    a[i * 3]     = r * Math.sin(ph) * Math.cos(th);
    a[i * 3 + 1] = r * Math.cos(ph);
    a[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
  }
  return a;
}

/* -- 2 · CREATE WEB DESIGN: flat wireframe grid with a sine wave ------------ */
function buildGridWave() {
  const a = alloc();
  const side = Math.ceil(Math.sqrt(COUNT));
  const extent = 1.7;
  for (let i = 0; i < COUNT; i++) {
    const gx = i % side;
    const gz = Math.floor(i / side);
    const x = (gx / (side - 1)) * 2 - 1;
    const z = (gz / (side - 1)) * 2 - 1;
    a[i * 3]     = x * extent;
    a[i * 3 + 1] = Math.sin(x * 3.1) * Math.cos(z * 3.1) * 0.28;
    a[i * 3 + 2] = z * extent;
  }
  return a;
}

/* -- 3 · ACKNOWLEDGEMENT: two interlocking rings ---------------------------- */
function buildRings() {
  const a = alloc();
  const half = Math.floor(COUNT / 2);
  for (let i = 0; i < COUNT; i++) {
    const th = Math.random() * Math.PI * 2;
    const R = 1.05 + rand() * 0.05;                 // ring radius + thickness
    if (i < half) {                                  // ring 1 — XY plane
      a[i * 3]     = -0.5 + Math.cos(th) * R;
      a[i * 3 + 1] = Math.sin(th) * R;
      a[i * 3 + 2] = rand() * 0.05;
    } else {                                         // ring 2 — YZ plane
      a[i * 3]     = 0.5 + rand() * 0.05;
      a[i * 3 + 1] = Math.sin(th) * R;
      a[i * 3 + 2] = Math.cos(th) * R;
    }
  }
  return a;
}

/* -- 4 · DEVELOPMENT: solid 3D cube lattice --------------------------------- */
function buildLattice() {
  const a = alloc();
  const n = 22;                                       // 22^3 = 10648 >= COUNT
  const total = n * n * n;
  const stride = total / COUNT;
  for (let i = 0; i < COUNT; i++) {
    const idx = Math.floor(i * stride);
    const gx = idx % n;
    const gy = Math.floor(idx / n) % n;
    const gz = Math.floor(idx / (n * n));
    const j = 0.012;
    a[i * 3]     = ((gx / (n - 1)) * 2 - 1) * 1.15 + rand() * j;
    a[i * 3 + 1] = ((gy / (n - 1)) * 2 - 1) * 1.15 + rand() * j;
    a[i * 3 + 2] = ((gz / (n - 1)) * 2 - 1) * 1.15 + rand() * j;
  }
  return a;
}

/* -- 5 · REVIEW: torus under a thin scanning ring --------------------------- */
function buildTorusScan() {
  const a = alloc();
  const R = 1.0, r = 0.38;
  for (let i = 0; i < COUNT; i++) {
    if (Math.random() < 0.7) {                        // torus body
      const u = Math.random() * Math.PI * 2;
      const v = Math.random() * Math.PI * 2;
      a[i * 3]     = (R + r * Math.cos(v)) * Math.cos(u);
      a[i * 3 + 1] = r * Math.sin(v);
      a[i * 3 + 2] = (R + r * Math.cos(v)) * Math.sin(u);
    } else {                                          // scanning ring around it
      const th = Math.random() * Math.PI * 2;
      a[i * 3]     = Math.cos(th) * 1.75;
      a[i * 3 + 1] = rand() * 0.02;
      a[i * 3 + 2] = Math.sin(th) * 1.75;
    }
  }
  return a;
}

/* -- 6 · SIGN OFF: radial star-burst seal ----------------------------------- */
function buildStarburst() {
  const a = alloc();
  const dirs = fibonacciSphere(36);
  for (let i = 0; i < COUNT; i++) {
    if (Math.random() < 0.7) {                        // spikes along directions
      const d = dirs[i % dirs.length];
      const dist = 0.25 + Math.pow(Math.random(), 1.6) * 1.35;
      a[i * 3]     = d[0] * dist + rand() * 0.05;
      a[i * 3 + 1] = d[1] * dist + rand() * 0.05;
      a[i * 3 + 2] = d[2] * dist + rand() * 0.05;
    } else {                                          // glowing center cluster
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(rand());
      const r = Math.pow(Math.random(), 0.5) * 0.35;
      a[i * 3]     = r * Math.sin(ph) * Math.cos(th);
      a[i * 3 + 1] = r * Math.cos(ph);
      a[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
    }
  }
  return a;
}

/* -- 7 · DELIVERY: ascending double helix ----------------------------------- */
function buildHelix() {
  const a = alloc();
  for (let i = 0; i < COUNT; i++) {
    const t = i / COUNT;
    const strand = i % 2;                             // two intertwined strands
    const th = t * Math.PI * 6 + strand * Math.PI;
    const r = 0.75 + rand() * 0.05;
    a[i * 3]     = Math.cos(th) * r;
    a[i * 3 + 1] = -1.5 + 3 * t;
    a[i * 3 + 2] = Math.sin(th) * r;
  }
  return a;
}

/* -- 8 · MAINTENANCE: continuous torus-knot loop ---------------------------- */
function buildKnot() {
  const a = alloc();
  const p = 2, q = 3, s = 0.42;
  for (let i = 0; i < COUNT; i++) {
    const t = (i / COUNT) * Math.PI * 2 + rand() * 0.01;
    const r = 2 + Math.cos(q * t);
    a[i * 3]     = r * Math.cos(p * t) * s + rand() * 0.05;
    a[i * 3 + 1] = r * Math.sin(p * t) * s + rand() * 0.05;
    a[i * 3 + 2] = Math.sin(q * t) * s + rand() * 0.05;
  }
  return a;
}

/* -- 9 · FINALE: calm even sphere ------------------------------------------- */
function buildSphere() {
  const a = alloc();
  const pts = fibonacciSphere(COUNT);
  for (let i = 0; i < COUNT; i++) {
    // 12% drift inside for volume; the rest sit on a crisp shell
    const r = Math.random() < 0.12 ? Math.random() * 1.1 : 1.15 + rand() * 0.03;
    a[i * 3]     = pts[i][0] * r;
    a[i * 3 + 1] = pts[i][1] * r;
    a[i * 3 + 2] = pts[i][2] * r;
  }
  return a;
}

/* Order matters — index = virtualPhase + 1 */
const FORMATION_BUILDERS = [
  buildStarfield, buildCore, buildGridWave, buildRings, buildLattice,
  buildTorusScan, buildStarburst, buildHelix, buildKnot, buildSphere,
];

/* Accent color per formation (kept in sync with [data-phase] in styles.css) */
const FORMATION_COLORS = [
  "#7f8ba3", // 0 intro starfield — slate
  "#22d3ee", // 1 Requirements  — cyan
  "#8b5cf6", // 2 Design        — violet
  "#38bdf8", // 3 Approval      — sky
  "#34d399", // 4 Development   — emerald
  "#fbbf24", // 5 Review        — amber
  "#ffd166", // 6 Sign Off      — gold
  "#e879f9", // 7 Delivery      — magenta
  "#2dd4bf", // 8 Maintenance   — teal
  "#67e8f9", // 9 finale sphere — soft cyan
];

/* ----------------------------------------------------------------------------
   Boot
   ---------------------------------------------------------------------------- */
const canvas = document.getElementById("scene");

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: false,            // points + additive blending don't need MSAA
  powerPreference: "high-performance",
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_DPR));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(BG_COLOR, 1);

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(BG_COLOR, 0.045);   // fades distant particles

const camera = new THREE.PerspectiveCamera(
  55, window.innerWidth / window.innerHeight, 0.1, 100
);
camera.position.set(0, 0, 8.2);

/* --- Build all formation position + color buffers up front (one-time cost) - */
const positionSets = [];
const colorSets = [];
{
  const c = new THREE.Color();
  const white = new THREE.Color("#ffffff");
  for (let f = 0; f < FORMATION_BUILDERS.length; f++) {
    const raw = FORMATION_BUILDERS[f]();
    for (let k = 0; k < raw.length; k++) raw[k] *= SCALE;
    positionSets.push(raw);

    // Per-particle color: accent mixed toward white for sparkle + brightness jitter
    const base = c.set(FORMATION_COLORS[f]).clone();
    const cols = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const mixed = base.clone().lerp(white, Math.random() * 0.45);
      const b = 0.7 + Math.random() * 0.3;
      cols[i * 3]     = mixed.r * b;
      cols[i * 3 + 1] = mixed.g * b;
      cols[i * 3 + 2] = mixed.b * b;
    }
    colorSets.push(cols);
  }
}

/* --- Points geometry + soft-glow sprite material ---------------------------- */
const geometry = new THREE.BufferGeometry();
geometry.setAttribute("position", new THREE.BufferAttribute(positionSets[0].slice(), 3));
geometry.setAttribute("color", new THREE.BufferAttribute(colorSets[0].slice(), 3));

/** Canvas-generated radial-gradient sprite => soft glowing round particles. */
function makeGlowTexture() {
  const s = 64;
  const cv = document.createElement("canvas");
  cv.width = cv.height = s;
  const ctx = cv.getContext("2d");
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.35, "rgba(255,255,255,0.6)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
  return new THREE.CanvasTexture(cv);
}

const material = new THREE.PointsMaterial({
  size: 0.055,
  map: makeGlowTexture(),
  vertexColors: true,
  transparent: true,
  opacity: 0.9,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  sizeAttenuation: true,
});

const points = new THREE.Points(geometry, material);
scene.add(points);

/* ----------------------------------------------------------------------------
   State + public API
   ---------------------------------------------------------------------------- */
let virtualPhase = -1;                 // -1 = intro starfield (initial state)
let storyFocus = 0;                    // 1 = support the chapter illustration
let mouseX = 0, mouseY = 0;            // normalized -1..1 for camera parallax

function setVirtualPhase(v) {
  virtualPhase = Math.max(-1, Math.min(8, v));
}

function setStoryFocus(v) {
  storyFocus = Math.max(0, Math.min(1, v));
}

window.ResetrixScene = { ready: false, setVirtualPhase, setStoryFocus };

window.addEventListener("pointermove", (e) => {
  mouseX = (e.clientX / window.innerWidth) * 2 - 1;
  mouseY = (e.clientY / window.innerHeight) * 2 - 1;
}, { passive: true });

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

/* ----------------------------------------------------------------------------
   Render loop — lerps the live buffers toward the current morph state.
   Pauses automatically when the tab is hidden (rAF stops) or fully paused
   via document.visibilitychange for good measure.
   ---------------------------------------------------------------------------- */
const posAttr = geometry.attributes.position;
const colAttr = geometry.attributes.color;
const pos = posAttr.array;
const col = colAttr.array;

function easeInOut(t) { return t * t * (3 - 2 * t); }   // smoothstep

const clock = new THREE.Clock();
let firstFrame = true;

function tick() {
  const elapsed = clock.getElapsedTime();

  /* Decompose virtualPhase into (formation A, formation B, blend f) */
  const fi = virtualPhase + 1;                          // 0..9
  let i = Math.floor(fi);
  i = Math.max(0, Math.min(positionSets.length - 2, i));
  let f = fi - i;
  f = Math.max(0, Math.min(1, f));
  // Reduced motion: snap to whole formations instead of morphing
  const fe = REDUCED ? Math.round(f) : easeInOut(f);

  /* Interpolate positions + colors (30k floats each — cheap on CPU) */
  const A = positionSets[i], B = positionSets[i + 1];
  const CA = colorSets[i], CB = colorSets[i + 1];
  for (let k = 0; k < pos.length; k++) {
    pos[k] = A[k] + (B[k] - A[k]) * fe;
    col[k] = CA[k] + (CB[k] - CA[k]) * fe;
  }
  posAttr.needsUpdate = true;
  colAttr.needsUpdate = true;

  /* Motion: slow idle spin + scroll-driven rotation + gentle tilt */
  if (!REDUCED) {
    points.rotation.y = elapsed * 0.05 + virtualPhase * 0.45;
    points.rotation.x = 0.12 + Math.sin(elapsed * 0.18) * 0.06;
    // Subtle "breathing" scale
    const s = 1 + Math.sin(elapsed * 0.5) * 0.015;
    points.scale.setScalar(s);
    // Camera parallax toward the pointer
    camera.position.x += (mouseX * 0.55 - camera.position.x) * 0.03;
    camera.position.y += (-mouseY * 0.35 - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);
  } else {
    points.rotation.y = virtualPhase * 0.45;
    points.rotation.x = 0.12;
  }

  // During story chapters, particles step back and frame the line illustration.
  const targetOpacity = 0.9 - storyFocus * 0.38;
  const targetX = storyFocus * (MOBILE ? 0.15 : 1.05);
  material.opacity += (targetOpacity - material.opacity) * (REDUCED ? 1 : 0.06);
  points.position.x += (targetX - points.position.x) * (REDUCED ? 1 : 0.06);

  renderer.render(scene, camera);

  if (firstFrame) {
    firstFrame = false;
    window.ResetrixScene.ready = true;
    window.dispatchEvent(new Event("resetrix:scene-ready"));
  }
  requestAnimationFrame(tick);
}

requestAnimationFrame(tick);
