/* =========================================================
   명리당 — 공통 스크립트
   ========================================================= */

/* ★★★★★  카카오톡 오픈채팅 링크를 여기에 넣으세요  ★★★★★
   예) const KAKAO_LINK = "https://open.kakao.com/o/abcd1234";
   이 한 줄만 바꾸면 사이트의 모든 카톡 버튼에 적용됩니다.    */
const KAKAO_LINK = "https://open.kakao.com/o/sgEYBxwi";
/* ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★ */

document.addEventListener("DOMContentLoaded", function () {
  applyKakaoLinks();
  initHeaderScroll();
  initMobileMenu();
  initHeroCarousel();
  initReviewCarousel();
  initReveal();
});

/* ---------- 카톡 링크 일괄 주입 ---------- */
function applyKakaoLinks() {
  const set = (KAKAO_LINK && KAKAO_LINK !== "#");
  document.querySelectorAll("[data-kakao]").forEach(function (el) {
    el.setAttribute("href", KAKAO_LINK || "#");
    if (set) {
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener");
    } else {
      // 링크 미설정 시 안내
      el.addEventListener("click", function (e) {
        e.preventDefault();
        alert("카카오톡 오픈채팅 링크가 아직 등록되지 않았습니다.\n( js/main.js 파일의 KAKAO_LINK 값을 수정하세요 )");
      });
    }
  });
}

/* ---------- 헤더 스크롤 시 배경 진하게 ---------- */
function initHeaderScroll() {
  const header = document.getElementById("header");
  if (!header) return;
  const onScroll = function () {
    header.classList.toggle("scrolled", window.scrollY > 40);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* ---------- 모바일 메뉴 토글 ---------- */
function initMobileMenu() {
  const toggle = document.getElementById("menuToggle");
  const links = document.getElementById("navLinks");
  if (!toggle || !links) return;

  toggle.addEventListener("click", function () {
    toggle.classList.toggle("open");
    links.classList.toggle("open");
  });
  // 메뉴 항목 클릭 시 닫기
  links.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      toggle.classList.remove("open");
      links.classList.remove("open");
    });
  });
}

/* ---------- 히어로 캐러셀 ---------- */
function initHeroCarousel() {
  const slides = Array.from(document.querySelectorAll(".hero-slide"));
  const dotsWrap = document.getElementById("heroDots");
  if (slides.length <= 1 || !dotsWrap) return;

  let idx = 0;
  let timer = null;

  // 점 인디케이터 생성
  slides.forEach(function (_, i) {
    const b = document.createElement("button");
    b.setAttribute("aria-label", (i + 1) + "번 슬라이드");
    if (i === 0) b.classList.add("active");
    b.addEventListener("click", function () { go(i); restart(); });
    dotsWrap.appendChild(b);
  });
  const dots = Array.from(dotsWrap.children);

  function go(n) {
    slides[idx].classList.remove("active");
    dots[idx].classList.remove("active");
    idx = (n + slides.length) % slides.length;
    slides[idx].classList.add("active");
    dots[idx].classList.add("active");
  }
  function next() { go(idx + 1); }
  function start() { timer = setInterval(next, 5000); }
  function restart() { clearInterval(timer); start(); }

  start();
}

/* ---------- 후기 캐러셀 ---------- */
function initReviewCarousel() {
  const track = document.getElementById("reviewTrack");
  const dotsWrap = document.getElementById("reviewDots");
  if (!track || !dotsWrap) return;

  const cards = Array.from(track.children);
  if (cards.length <= 1) return;

  let idx = 0;
  let timer = null;

  cards.forEach(function (_, i) {
    const b = document.createElement("button");
    b.setAttribute("aria-label", (i + 1) + "번 후기");
    if (i === 0) b.classList.add("active");
    b.addEventListener("click", function () { go(i); restart(); });
    dotsWrap.appendChild(b);
  });
  const dots = Array.from(dotsWrap.children);

  function go(n) {
    idx = (n + cards.length) % cards.length;
    track.style.transform = "translateX(" + (-100 * idx) + "%)";
    dots.forEach(function (d, i) { d.classList.toggle("active", i === idx); });
  }
  function next() { go(idx + 1); }
  function start() { timer = setInterval(next, 4500); }
  function restart() { clearInterval(timer); start(); }

  start();
}

/* ---------- 스크롤 등장 애니메이션 ---------- */
function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("show"); });
    return;
  }
  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  items.forEach(function (el) { io.observe(el); });
}
