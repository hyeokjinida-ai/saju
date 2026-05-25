/* =========================================================
   명리당 · 사주 리포트 랜딩 — 공통 스크립트
   ========================================================= */

/* =========================================================
   ★ 설정값 (여기만 바꾸면 사이트 전체에 적용) ★
   ========================================================= */
const CONFIG = {
  brand: "명리당",

  // ▼ 카카오톡 상담 링크 — 이 한 줄만 바꾸면 전체 적용됩니다.
  //   오픈채팅 예) https://open.kakao.com/o/xxxxxxx
  //   채널 예)     https://pf.kakao.com/_YOUR_CHANNEL_ID/chat
  KAKAO_CHAT_URL: "https://open.kakao.com/o/sgEYBxwi",

  // ▼ 상품명 / 가격 (바꾸면 신청·요약에 반영)
  products: {
    basic:   { name: "기본 사주 리포트",   price: 19000 },
    premium: { name: "프리미엄 사주 리포트", price: 39000 }
  },

  // localStorage 키
  storeKey: "saju_apply_v1"
};

/* 가격 포맷: 19000 -> "19,000원" */
function won(n) { return Number(n).toLocaleString("ko-KR") + "원"; }

/* =========================================================
   페이지 공통 초기화
   ========================================================= */
document.addEventListener("DOMContentLoaded", function () {
  initImages();
  initReveal();
  initApplyForm();   // /apply 에서만 동작
  initThanks();      // /thanks 에서만 동작
});

/* ---------- 배경 이미지 자동 적용 (없으면 그라데이션 유지) ---------- */
function initImages() {
  document.querySelectorAll("[data-bg]").forEach(function (el) {
    const src = el.getAttribute("data-bg");
    if (!src) return;
    const probe = new Image();
    probe.onload = function () {
      el.style.backgroundImage = "url('" + src + "')";
      el.classList.add("show");
    };
    probe.src = src;
  });
}

/* ---------- 스크롤 fade-in ---------- */
function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;
  if (!("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("show"); });
    return;
  }
  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) { entry.target.classList.add("show"); io.unobserve(entry.target); }
    });
  }, { threshold: 0.12 });
  items.forEach(function (el) { io.observe(el); });
}

/* =========================================================
   /apply — 신청 폼
   ========================================================= */
function initApplyForm() {
  const form = document.getElementById("applyForm");
  if (!form) return;

  const err = document.getElementById("applyError");
  function showError(msg, focusEl) {
    err.textContent = msg;
    err.classList.add("show");
    if (focusEl) focusEl.focus();
    err.scrollIntoView({ behavior: "smooth", block: "center" });
  }
  function clearError() { err.classList.remove("show"); err.textContent = ""; }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    clearError();

    const name = form.querySelector("#ap-name").value.trim();
    const gender = (form.querySelector('input[name="gender"]:checked') || {}).value || "";
    const birth = form.querySelector("#ap-birth").value;
    const cal = (form.querySelector('input[name="cal"]:checked') || {}).value || "";

    // 필수값 검증
    if (!name)   return showError("이름을 입력해 주세요.", form.querySelector("#ap-name"));
    if (!gender) return showError("성별을 선택해 주세요.");
    if (!birth)  return showError("생년월일을 입력해 주세요.", form.querySelector("#ap-birth"));
    if (!cal)    return showError("양력 / 음력을 선택해 주세요.");

    const product = (form.querySelector('input[name="product"]:checked') || {}).value || CONFIG.products.basic.name;
    const timeKnow = form.querySelector("#ap-time-know").value;
    const time = form.querySelector("#ap-time").value.trim();
    const topics = Array.from(form.querySelectorAll('input[name="topics"]:checked')).map(function (c) { return c.value; });
    const worry = form.querySelector("#ap-worry").value.trim();
    const contact = form.querySelector("#ap-contact").value.trim();

    const data = {
      product: product,
      name: name,
      gender: gender,
      birth: birth,
      cal: cal,
      timeKnow: timeKnow,
      time: time,
      topics: topics,
      worry: worry,
      contact: contact,
      createdAt: new Date().toISOString()
    };

    // 제출 처리 (백엔드 연결은 submitApplication 안에서)
    submitApplication(data).then(function () {
      window.location.href = "/thanks";
    });
  });
}

/* ---------- 제출 함수 (백엔드 연결 지점) ----------
   지금은 localStorage 저장만 함.
   나중에 Supabase / Google Sheet / Airtable 등에 저장하려면
   아래 fetch 부분의 주석을 풀고 엔드포인트만 넣으면 됩니다.        */
function submitApplication(data) {
  // 1) 로컬 저장 (완료 페이지 요약용)
  try { localStorage.setItem(CONFIG.storeKey, JSON.stringify(data)); } catch (e) {}

  // 2) (선택) 백엔드 저장 — 나중에 여기만 채우면 됩니다.
  // return fetch("https://YOUR_ENDPOINT", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(data)
  // }).then(function () { return true; }).catch(function () { return true; });

  return Promise.resolve(true);
}

/* =========================================================
   /thanks — 완료 페이지
   ========================================================= */
function initThanks() {
  const kakaoBtn = document.getElementById("kakaoBtn");
  if (!kakaoBtn) return;

  // 카톡 버튼 링크 연결
  kakaoBtn.setAttribute("href", CONFIG.KAKAO_CHAT_URL || "#");
  if (CONFIG.KAKAO_CHAT_URL && CONFIG.KAKAO_CHAT_URL !== "#") {
    kakaoBtn.setAttribute("target", "_blank");
    kakaoBtn.setAttribute("rel", "noopener");
  }

  // 입력 요약 표시
  let data = null;
  try { data = JSON.parse(localStorage.getItem(CONFIG.storeKey) || "null"); } catch (e) {}

  const summary = document.getElementById("summary");
  const fallback = document.getElementById("summaryFallback");

  if (data && data.name) {
    const dl = document.getElementById("summaryList");
    const rows = [
      ["신청 상품", data.product],
      ["이름", data.name],
      ["성별", data.gender],
      ["생년월일", data.birth],
      ["양력/음력", data.cal],
      ["태어난 시간", data.time ? (data.timeKnow + " · " + data.time) : data.timeKnow],
      ["궁금한 주제", (data.topics && data.topics.length) ? data.topics.join(", ") : "-"]
    ];
    if (data.worry) rows.push(["남긴 고민", data.worry]);
    if (data.contact) rows.push(["카톡/연락처", data.contact]);

    dl.innerHTML = rows.map(function (r) {
      return "<dt>" + escapeHtml(r[0]) + "</dt><dd>" + escapeHtml(r[1] || "-") + "</dd>";
    }).join("");
    summary.style.display = "block";
  } else {
    fallback.style.display = "block";
  }
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}
