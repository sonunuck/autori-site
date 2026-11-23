/* 오토리 홈페이지 v2 — 최소한의 동작만 (외부 라이브러리 없음) */
(() => {
  "use strict";
  document.documentElement.classList.add("js");
  const reduceMQ = window.matchMedia("(prefers-reduced-motion: reduce)");

  // 1. 모바일 메뉴
  const toggle = document.querySelector(".menu-toggle");
  const menu = document.getElementById("mobile-menu");
  if (toggle && menu) {
    const setOpen = (open) => {
      menu.hidden = !open;
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
    };
    toggle.addEventListener("click", () => setOpen(menu.hidden));
    menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !menu.hidden) { setOpen(false); toggle.focus(); }
    });
    window.matchMedia("(min-width: 1024px)").addEventListener("change", (m) => { if (m.matches) setOpen(false); });
  }

  // 2. 솔루션 펼침 메뉴 (데스크톱)
  document.querySelectorAll(".nav-drop").forEach((drop) => {
    const btn = drop.querySelector("button");
    const panel = drop.querySelector(".drop");
    if (!btn || !panel) return;
    const setOpen = (open) => { panel.hidden = !open; btn.setAttribute("aria-expanded", String(open)); };
    btn.addEventListener("click", (e) => { e.stopPropagation(); setOpen(panel.hidden); });
    document.addEventListener("click", (e) => { if (!drop.contains(e.target)) setOpen(false); });
    drop.addEventListener("keydown", (e) => { if (e.key === "Escape") { setOpen(false); btn.focus(); } });
    drop.addEventListener("focusout", (e) => { if (!drop.contains(e.relatedTarget)) setOpen(false); });
  });

  // 3. 주소가 비었거나 【 】 빈칸이면 숨기기 (크몽 엑셀 주소, 문의 양식 주소 등)
  document.querySelectorAll("[data-optional-link]").forEach((el) => {
    const a = el.matches("a") ? el : el.querySelector("a[href]");
    const href = ((a && a.getAttribute("href")) || "").trim();
    if (!href || href === "#" || href.includes("【")) {
      const target = el.closest("[data-optional-wrap]") || el;
      target.hidden = true;
    }
  });

  // 4. 없는 이미지는 자리 상자로
  document.querySelectorAll(".screen img").forEach((img) => {
    const fail = () => {
      const box = document.createElement("div");
      box.className = "screen-missing";
      box.textContent = "실제 화면 자리 — " + (img.getAttribute("src") || "").split("/").pop();
      img.replaceWith(box);
    };
    if (img.complete && img.naturalWidth === 0) fail(); else img.addEventListener("error", fail);
  });

  // 5. 스크롤 등장
  const items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && items.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -10% 0px" });
    items.forEach((el) => io.observe(el));
  } else {
    items.forEach((el) => el.classList.add("is-in"));
  }

  // 6. 고객 말 장면: 화면이 멈춘 채 스크롤에 맞춰 말풍선이 하나씩
  //    (태블릿 이상 + 움직임 허용일 때만. 아니면 모두 그냥 보임)
  document.querySelectorAll("[data-scene]").forEach((scene) => {
    const bubbles = [...scene.querySelectorAll(".bubble")];
    const wide = window.matchMedia("(min-width: 768px)");
    let ticking = false;
    const onScroll = () => {
      ticking = false;
      if (!scene.classList.contains("scene--live")) return;
      const r = scene.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 1;
      bubbles.forEach((b, i) => b.classList.toggle("is-on", p > (i + 0.4) / (bubbles.length + 1)));
    };
    const setup = () => {
      const live = wide.matches && !reduceMQ.matches;
      scene.classList.toggle("scene--live", live);
      if (!live) bubbles.forEach((b) => b.classList.add("is-on"));
      onScroll();
    };
    window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
    wide.addEventListener("change", setup);
    reduceMQ.addEventListener("change", setup);
    setup();
  });

  // 7. 솔루션 찾기: 검색창에 할 일이 저절로 타이핑되고, 맞는 솔루션이 오른쪽에 열림
  //    누르거나 화살표 키를 쓰면 자동 넘김은 멈춤. 마우스를 올려 두는 동안은 잠시 멈춤.
  document.querySelectorAll("[data-finder]").forEach((f) => {
    const tabs = [...f.querySelectorAll('[role="tab"]')];
    const panels = tabs.map((t) => document.getElementById(t.getAttribute("aria-controls")));
    const out = f.querySelector("[data-typed]");
    if (!tabs.length || !out) return;
    let cur = 0, auto = true, paused = false, timer = 0;
    const select = (i, focus) => {
      cur = i;
      tabs.forEach((t, j) => {
        t.setAttribute("aria-selected", String(j === i));
        t.tabIndex = j === i ? 0 : -1;
        if (panels[j]) panels[j].hidden = j !== i;
      });
      if (focus) tabs[i].focus();
    };
    const stop = () => { auto = false; clearTimeout(timer); };
    const show = (i, focus) => { stop(); select(i, focus); out.textContent = tabs[i].dataset.say || ""; };
    tabs.forEach((t, i) => {
      t.addEventListener("click", () => show(i));
      t.addEventListener("keydown", (e) => {
        const k = e.key;
        if (k === "ArrowDown" || k === "ArrowRight") { e.preventDefault(); show((cur + 1) % tabs.length, true); }
        if (k === "ArrowUp" || k === "ArrowLeft") { e.preventDefault(); show((cur - 1 + tabs.length) % tabs.length, true); }
      });
    });
    f.addEventListener("pointerenter", () => { paused = true; });
    f.addEventListener("pointerleave", () => { paused = false; });
    const next = (i) => { timer = setTimeout(() => type((i + 1) % tabs.length), 3400); };
    const type = (i) => {
      if (!auto) return;
      if (paused) { timer = setTimeout(() => type(i), 600); return; }
      select(i);
      const s = tabs[i].dataset.say || "";
      if (reduceMQ.matches) { out.textContent = s; next(i); return; }
      let n = 0;
      const step = () => {
        if (!auto) return;
        out.textContent = s.slice(0, ++n);
        if (n < s.length) timer = setTimeout(step, 65); else next(i);
      };
      out.textContent = "";
      step();
    };
    select(0);
    out.textContent = tabs[0].dataset.say || "";
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((es) => {
        if (es[0].isIntersecting) { io.disconnect(); timer = setTimeout(() => type(0), 400); }
      }, { threshold: 0.3 });
      io.observe(f);
    }
  });
})();
