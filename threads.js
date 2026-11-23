/* 오토리 첫 화면 물결선 — 살구색 선 여러 가닥이 천천히 물결칩니다.
   라이브러리 없이 WebGL 하나로 그립니다.
   - "움직임 줄이기" 설정이면 한 장면만 그리고 멈춥니다.
   - WebGL이 없으면 아무것도 그리지 않습니다 (글과 버튼은 그대로 보임).
   - 화면 밖으로 나가거나 탭이 숨겨지면 멈춥니다. */
(() => {
  "use strict";
  const canvas = document.querySelector("canvas.threads");
  if (!canvas) return;
  const gl = canvas.getContext("webgl", { alpha: true, antialias: false, premultipliedAlpha: true });
  if (!gl) { canvas.remove(); return; }

  const vert = "attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }";
  const frag = `
precision mediump float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uNarrow;
const vec3 COLOR = vec3(0.996, 0.694, 0.482); /* apricot #FEB17B */
#define N 30
float wave(float x, float t, float i) {
  return sin(x * 2.3 + t * 0.55 + i * 0.23) * 0.5
       + sin(x * 3.9 - t * 0.37 + i * 0.11) * 0.28
       + sin(x * 1.2 + t * 0.21 - i * 0.07) * 0.22;
}
void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float x = uv.x;
  float acc = 0.0;
  float pull = exp(-pow((x - uMouse.x) * 3.0, 2.0)) * (uMouse.y - 0.5) * 0.12;
  for (int k = 0; k < N; k++) {
    float i = float(k);
    float f = i / float(N - 1);
    float spread = mix(0.05, 0.42, smoothstep(0.0, 1.0, x));
    float base = mix(0.16, 0.62, x) + (f - 0.5) * spread;
    float amp = 0.11 * smoothstep(0.05, 1.0, x);
    float y = base + amp * wave(x * 2.6, uTime, i) + pull * (0.4 + f);
    float d = abs(uv.y - y) * uRes.y;
    float w = 0.55 + 0.9 * x;
    float line = 1.0 - smoothstep(w - 0.35, w + 1.1, d);
    acc += line * (0.25 + 0.75 * f);
  }
  float fade = mix(smoothstep(0.30, 0.78, x), smoothstep(0.0, 0.6, x) * 0.7, uNarrow);
  float a = clamp(acc * 0.85, 0.0, 1.0) * fade;
  gl_FragColor = vec4(COLOR * a, a);
}`;

  const sh = (type, src) => {
    const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
  };
  const vs = sh(gl.VERTEX_SHADER, vert), fs = sh(gl.FRAGMENT_SHADER, frag);
  if (!vs || !fs) { canvas.remove(); return; }
  const prog = gl.createProgram();
  gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { canvas.remove(); return; }
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "p");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(prog, "uRes");
  const uTime = gl.getUniformLocation(prog, "uTime");
  const uMouse = gl.getUniformLocation(prog, "uMouse");
  const uNarrow = gl.getUniformLocation(prog, "uNarrow");

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  let mouse = [0.7, 0.5], target = [0.7, 0.5];
  let running = false, visible = true, raf = 0, start = performance.now();

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const w = Math.round(canvas.clientWidth * dpr), h = Math.round(canvas.clientHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    gl.viewport(0, 0, w, h);
    gl.uniform2f(uRes, w, h);
    gl.uniform1f(uNarrow, canvas.clientWidth < 768 ? 1 : 0);
  };
  const draw = (t) => {
    mouse[0] += (target[0] - mouse[0]) * 0.05;
    mouse[1] += (target[1] - mouse[1]) * 0.05;
    gl.uniform1f(uTime, t);
    gl.uniform2f(uMouse, mouse[0], mouse[1]);
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };
  const loop = (now) => {
    if (!running) return;
    draw((now - start) / 1000);
    raf = requestAnimationFrame(loop);
  };
  const update = () => {
    const should = visible && !document.hidden && !reduce.matches;
    if (should && !running) { running = true; raf = requestAnimationFrame(loop); }
    if (!should && running) { running = false; cancelAnimationFrame(raf); }
    if (reduce.matches) draw(8);
  };

  resize(); draw(8);
  window.addEventListener("resize", () => { resize(); if (!running) draw(8); });
  canvas.parentElement.addEventListener("pointermove", (e) => {
    const r = canvas.getBoundingClientRect();
    target = [(e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height];
  });
  document.addEventListener("visibilitychange", update);
  reduce.addEventListener("change", update);
  new IntersectionObserver((es) => { visible = es[0].isIntersecting; update(); }).observe(canvas);
})();
