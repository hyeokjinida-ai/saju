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
  initSajuForm();
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

/* ---------- 사주 신청서 폼 ---------- */
function initSajuForm() {
  const form = document.getElementById("sajuForm");
  if (!form) return;

  const typeSel = document.getElementById("f-type");
  const partnerWrap = document.getElementById("partner-wrap");
  const timeInput = document.getElementById("f-time");
  const timeUnknown = document.getElementById("f-time-unknown");
  const msg = document.getElementById("formMsg");

  // URL 파라미터(?type=)로 상담 종류 미리 선택
  const params = new URLSearchParams(location.search);
  const preType = params.get("type");
  if (preType) {
    const opt = Array.from(typeSel.options).find(function (o) { return o.value === preType; });
    if (opt) typeSel.value = preType;
  }

  // 궁합 선택 시 상대방 정보 표시
  function togglePartner() {
    partnerWrap.style.display = (typeSel.value === "궁합사주") ? "block" : "none";
  }
  typeSel.addEventListener("change", togglePartner);
  togglePartner();

  // 시간 모름 체크 시 시간 입력 비활성화
  timeUnknown.addEventListener("change", function () {
    timeInput.disabled = timeUnknown.checked;
    if (timeUnknown.checked) timeInput.value = "";
  });

  function showMsg(text, ok) {
    msg.textContent = text;
    msg.classList.add("show");
    msg.classList.toggle("ok", !!ok);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("f-name").value.trim();
    const birth = document.getElementById("f-birth").value;
    if (!name) { showMsg("이름을 입력해 주세요.", false); document.getElementById("f-name").focus(); return; }
    if (!birth) { showMsg("생년월일을 입력해 주세요.", false); document.getElementById("f-birth").focus(); return; }

    const type = typeSel.value;
    const gender = (form.querySelector('input[name="gender"]:checked') || {}).value || "";
    const cal = document.getElementById("f-cal").value;
    const time = timeUnknown.checked ? "모름" : (timeInput.value || "미입력");
    const question = document.getElementById("f-question").value.trim();
    const partner = document.getElementById("f-partner").value.trim();

    let lines = [];
    lines.push("[명리당 사주 신청]");
    lines.push("· 상담: " + type);
    lines.push("· 이름: " + name);
    lines.push("· 성별: " + gender);
    lines.push("· 양/음력: " + cal);
    lines.push("· 생년월일: " + birth);
    lines.push("· 태어난 시간: " + time);
    if (type === "궁합사주" && partner) lines.push("· 상대방: " + partner);
    if (question) lines.push("· 궁금한 점: " + question);
    const text = lines.join("\n");

    // 클립보드 복사 (실패 시 fallback)
    function openKakao() {
      const link = (typeof KAKAO_LINK !== "undefined") ? KAKAO_LINK : "#";
      if (link && link !== "#") {
        window.open(link, "_blank", "noopener");
      }
    }

    function done(copied) {
      showMsg(
        (copied ? "신청 내용이 복사됐어요! " : "아래 내용을 복사해 ") +
        "카카오톡 채팅창에 붙여넣고 보내주세요.\n\n" + text,
        true
      );
      msg.style.whiteSpace = "pre-line";
      msg.style.textAlign = "left";
      openKakao();
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
    } else {
      done(false);
    }
  });
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
