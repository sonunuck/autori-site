(() => {
  "use strict";

  // 1. 모바일 메뉴 열고 닫기
  const menuToggle = document.querySelector(".menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");

  if (menuToggle && mobileMenu) {
    const closeMenu = () => {
      mobileMenu.hidden = true;
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "메뉴 열기");
    };

    menuToggle.addEventListener("click", () => {
      const isOpen = !mobileMenu.hidden;
      if (isOpen) {
        closeMenu();
      } else {
        mobileMenu.hidden = false;
        menuToggle.setAttribute("aria-expanded", "true");
        menuToggle.setAttribute("aria-label", "메뉴 닫기");
      }
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !mobileMenu.hidden) {
        closeMenu();
        menuToggle.focus();
      }
    });
  }

  // 2. 크몽 주소가 비어 있거나 빈칸(【 】)이면 링크 숨기기
  document.querySelectorAll("[data-kmong-link]").forEach((link) => {
    const rawHref = (link.getAttribute("href") || "").trim();
    const isUnset =
      rawHref === "" ||
      rawHref === "#" ||
      rawHref.includes("【") ||
      rawHref.includes("】");

    if (isUnset) {
      link.hidden = true;
    }
  });

  // 3. 로고 이미지가 없으면 Pretendard 700 글자("오토리")만 표시
  document.querySelectorAll("img[data-logo-fallback]").forEach((img) => {
    const showWordmark = () => {
      img.hidden = true;
      const wordmark = img.nextElementSibling;
      if (wordmark && wordmark.classList.contains("brand-wordmark")) {
        wordmark.hidden = false;
      }
    };

    img.addEventListener("error", showWordmark);
    if (img.complete && img.naturalWidth === 0) {
      showWordmark();
    }
  });

  // 4. 제품 화면 이미지가 없으면 자리 상자 표시(또는 단계 화면 숨김)
  document.querySelectorAll("[data-missing]").forEach((figure) => {
    const mode = figure.getAttribute("data-missing");
    const img = figure.querySelector("img");
    if (!img) return;

    const handleMissing = () => {
      if (mode === "hide") {
        figure.hidden = true;
        const stepItem = figure.closest(".step-item");
        if (stepItem) {
          stepItem.classList.add("is-screen-hidden");
        }
        return;
      }

      if (mode === "placeholder") {
        img.hidden = true;
        const placeholder = figure.querySelector(".screen-placeholder");
        if (placeholder) {
          placeholder.hidden = false;
        }
      }
    };

    img.addEventListener("error", handleMissing);
    if (img.complete && img.naturalWidth === 0) {
      handleMissing();
    }
  });
})();
