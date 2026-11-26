// Shared 3D pieces for the Skillactiv "Learning Lab" concepts.
// Classic script (works from file://). Usage inside a module:
//   const L = window.Lab3D(THREE);
window.Lab3D = (THREE) => {
  const C = { teal: 0x0e4f4c, amber: 0xe2a43b, bone: 0xf7f4ee, ink: 0x23292a, sage: 0x9fb7b3 };
  const mat = (c, ro = 0.5) => new THREE.MeshStandardMaterial({ color: c, roughness: ro, metalness: 0 });

  function slab(w, d, h, r, color, ro = 0.5) {
    const s = new THREE.Shape(), x = -w / 2, y = -d / 2;
    s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
    s.lineTo(x + w, y + d - r); s.quadraticCurveTo(x + w, y + d, x + w - r, y + d);
    s.lineTo(x + r, y + d); s.quadraticCurveTo(x, y + d, x, y + d - r);
    s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
    const b = Math.min(0.04, h / 3);
    const g = new THREE.ExtrudeGeometry(s, { depth: h, bevelEnabled: true, bevelThickness: b, bevelSize: b, bevelSegments: 4, curveSegments: 12 });
    g.rotateX(-Math.PI / 2);
    return new THREE.Mesh(g, mat(color, ro));
  }

  function setup(canvas, w, h, { exposure = 1.05, ground = -0.001, shadow = 6 } = {}) {
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2)); renderer.setSize(w, h);
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = exposure;
    return renderer;
  }

  function stage({ groundY = 0, shadowOpacity = 0.16, size = 6 } = {}) {
    const scene = new THREE.Scene();
    scene.add(new THREE.HemisphereLight(0xfffaf0, 0xb3ac9e, 1.65));
    const sun = new THREE.DirectionalLight(0xffffff, 2.2);
    sun.position.set(-4, 10, 6); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.radius = 6;
    Object.assign(sun.shadow.camera, { left: -size, right: size, top: size, bottom: -size });
    scene.add(sun);
    const g = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.ShadowMaterial({ opacity: shadowOpacity }));
    g.rotation.x = -Math.PI / 2; g.position.y = groundY; g.receiveShadow = true; scene.add(g);
    return scene;
  }

  const shadows = (o) => { o.traverse((m) => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } }); return o; };

  // 01 Learning content: a lesson "screen" with a video tile and text lines
  function content({ base = true } = {}) {
    const g = new THREE.Group();
    const top = base ? 0.22 : 0;
    if (base) g.add(slab(2.6, 1.9, 0.18, 0.25, C.bone));
    const screen = slab(1.45, 0.95, 0.06, 0.08, C.teal, 0.45); screen.position.set(-0.42, top + 0.02, -0.25); g.add(screen);
    const play = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.06, 3), mat(C.amber, 0.35));
    play.position.set(-0.42, top + 0.12, -0.25); play.rotation.y = Math.PI / 2; g.add(play);
    [[0.78, -0.55, 0.62], [0.78, -0.3, 0.48], [0.78, -0.05, 0.56]].forEach(([x, z, w]) => {
      const l = slab(w, 0.1, 0.04, 0.04, C.ink); l.position.set(x, top + 0.02, z); g.add(l);
    });
    [[-0.75, 0.55, C.amber], [0.05, 0.55, C.bone], [0.85, 0.55, C.bone]].forEach(([x, z, c]) => {
      const k = slab(0.62, 0.42, 0.08, 0.08, c, 0.4); k.position.set(x, top + 0.02, z); g.add(k);
    });
    return shadows(g);
  }

  // 02 Training & workshops: a round table with people around it
  function training({ base = true } = {}) {
    const g = new THREE.Group();
    const top = base ? 0.22 : 0;
    if (base) g.add(slab(2.6, 1.9, 0.18, 0.25, C.amber));
    const table = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.14, 48), mat(C.bone, 0.45));
    table.position.y = top + 0.27; g.add(table);
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.14, 0.22, 24), mat(C.ink)); leg.position.y = top + 0.11; g.add(leg);
    const cols = [C.teal, C.ink, C.teal, C.bone, C.teal, C.ink];
    cols.forEach((c, i) => {
      const a = (i / cols.length) * Math.PI * 2 + 0.3;
      const p = new THREE.Group();
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.15, 0.32, 24), mat(c));
      body.position.y = 0.16; p.add(body);
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.11, 24, 16), mat(c === C.bone ? C.amber : c, 0.4));
      head.position.y = 0.42; p.add(head);
      p.position.set(Math.cos(a) * 0.86, top, Math.sin(a) * 0.72); g.add(p);
    });
    return shadows(g);
  }

  // 03 Training events: a full room facing a small stage
  function events({ base = true } = {}) {
    const g = new THREE.Group();
    const top = base ? 0.22 : 0;
    if (base) g.add(slab(2.6, 1.9, 0.18, 0.25, C.teal));
    const st = slab(1.5, 0.38, 0.14, 0.06, C.amber, 0.45); st.position.set(0, top, -0.64); g.add(st);
    const spk = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 0.26, 20), mat(C.bone)); spk.position.set(0, top + 0.3, -0.64); g.add(spk);
    const sh = new THREE.Mesh(new THREE.SphereGeometry(0.075, 20, 12), mat(C.bone)); sh.position.set(0, top + 0.5, -0.64); g.add(sh);
    for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) {
      const s = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.09, 0.16, 18), mat(r === 1 && c === 3 ? C.amber : C.bone, 0.45));
      s.position.set(-0.85 + c * 0.34, top + 0.08, -0.1 + r * 0.32); g.add(s);
      const hd = new THREE.Mesh(new THREE.SphereGeometry(0.065, 16, 10), mat(r === 1 && c === 3 ? C.amber : C.bone, 0.45));
      hd.position.set(s.position.x, top + 0.22, s.position.z); g.add(hd);
    }
    return shadows(g);
  }

  function project(v, obj, cam, w, h) {
    const p = v.clone().applyMatrix4(obj.matrixWorld).project(cam);
    return { x: (p.x + 1) / 2 * w, y: (1 - p.y) / 2 * h };
  }

  return { C, mat, slab, setup, stage, shadows, content, training, events, project };
};
