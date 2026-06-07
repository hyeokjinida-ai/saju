/* =========================================================
   명운록 · 사주 리포트 랜딩 — 공통 스크립트
   ========================================================= */

/* =========================================================
   ★ 설정값 (여기만 바꾸면 사이트 전체에 적용) ★
   ========================================================= */
const CONFIG = {
  brand: "명운록",
  slogan: "삶의 흐름을 기록한 사주 리포트",
  sloganSub: "지나온 시간과 앞으로의 방향을 차분히 살펴봅니다.",

  // ▼ 카카오톡 상담 링크 — 이 한 줄만 바꾸면 전체 적용됩니다.
  //   오픈채팅 예) https://open.kakao.com/o/xxxxxxx
  //   채널 예)     https://pf.kakao.com/_YOUR_CHANNEL_ID/chat
  KAKAO_CHAT_URL: "https://open.kakao.com/o/sgEYBxwi",

  // ▼ 신청 데이터가 저장될 구글 시트(Apps Script) 웹앱 URL
  SHEET_URL: "https://script.google.com/macros/s/AKfycbypZgEkck6w_SxNWg64OuwLhLlwYCw-0B_M8V-pgV1IsAW6YXoth7Z2sXS81sTzQMrHpA/exec",

  // ▼ 상품명 (가격은 사이트에 노출하지 않고 카카오톡에서 안내)
  //   price 값은 내부 참고용 — 화면에는 표시되지 않음
  products: {
    basic:   { name: "명운록 簡命 (간명)",   price: 9900, original: 19900 },
    premium: { name: "명운록 深命 (심명)",   price: 39900, original: 79900, upgradeFromBasic: 30000 },
    // 추후 확장 상품 (현재 랜딩에는 노출하지 않음)
    comprehensive: { name: "명운록 종합 기록", price: 79900 }
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
  initSceneryFromHandoff();
});

/* ============================================================
   Claude Design 핸드오프 SVG (LunarMansionChart, Galaxy, Mountain, Sun Radiant)
   ============================================================ */
function initSceneryFromHandoff() {
  const lunar = document.getElementById("lunar-svg");
  if (lunar) lunar.innerHTML = buildLunarMansion(280);

  const galaxy = document.getElementById("galaxy-svg");
  if (galaxy) galaxy.innerHTML = buildGalaxy(260);

  const mtn = document.getElementById("mountain-svg-band");
  if (mtn) mtn.innerHTML = buildMountain(260, true);

  const sun = document.getElementById("sun-radiant-svg");
  if (sun) sun.innerHTML = buildSunRadiant(320);
}

/* 28수 천문도 */
function buildLunarMansion(size) {
  const mansions = ["角","亢","氐","房","心","尾","箕","斗","牛","女","虛","危","室","壁","奎","婁","胃","昴","畢","觜","參","井","鬼","柳","星","張","翼","軫"];
  const guards = [{a:0,h:"青龍",l:"東"},{a:90,h:"玄武",l:"北"},{a:180,h:"白虎",l:"西"},{a:270,h:"朱雀",l:"南"}];
  const cx=size/2, cy=size/2, rO=size*0.46, rR=size*0.40, rI=size*0.28, rC=size*0.16;
  const N=mansions.length, step=360/N, st=-90-step/2;
  let s = `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" style="display:block"><defs>`+
    `<radialGradient id="lm-bg" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#1a0810" stop-opacity=".3"/><stop offset="100%" stop-color="#0d0608" stop-opacity=".9"/></radialGradient>`+
    `<radialGradient id="lm-core" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#e8c878" stop-opacity=".8"/><stop offset="100%" stop-color="#d4af6a" stop-opacity="0"/></radialGradient></defs>`;
  s += `<circle cx="${cx}" cy="${cy}" r="${rO}" fill="url(#lm-bg)"/>`+
    `<circle cx="${cx}" cy="${cy}" r="${rO}" fill="none" stroke="rgba(212,175,106,.6)" stroke-width=".8"/>`+
    `<circle cx="${cx}" cy="${cy}" r="${rR}" fill="none" stroke="rgba(212,175,106,.35)" stroke-width=".6"/>`+
    `<circle cx="${cx}" cy="${cy}" r="${rI}" fill="none" stroke="rgba(212,175,106,.4)" stroke-width=".6"/>`+
    `<circle cx="${cx}" cy="${cy}" r="${rC}" fill="none" stroke="rgba(212,175,106,.6)" stroke-width=".8"/>`;
  [0,7,14,21].forEach(function(i){ const a=(st+i*step)*Math.PI/180;
    s += `<line x1="${cx+Math.cos(a)*rC}" y1="${cy+Math.sin(a)*rC}" x2="${cx+Math.cos(a)*rO}" y2="${cy+Math.sin(a)*rO}" stroke="rgba(212,175,106,.55)" stroke-width=".8"/>`;
  });
  mansions.forEach(function(h,i){ const a=(st+(i+0.5)*step)*Math.PI/180; const r=(rR+rO)/2;
    const x=cx+Math.cos(a)*r, y=cy+Math.sin(a)*r;
    s += `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" font-family="'Ma Shan Zheng','Nanum Myeongjo',serif" font-size="${size*0.045}" fill="rgba(240,230,210,.85)">${h}</text>`;
  });
  guards.forEach(function(g){ const a=(g.a-90)*Math.PI/180; const r=(rC+rI)/2;
    const x=cx+Math.cos(a)*r, y=cy+Math.sin(a)*r;
    s += `<text x="${x}" y="${y-4}" text-anchor="middle" dominant-baseline="central" font-family="'Ma Shan Zheng',serif" font-size="${size*0.052}" fill="#d4af6a">${g.h}</text>`+
         `<text x="${x}" y="${y+12}" text-anchor="middle" dominant-baseline="central" font-family="'Nanum Myeongjo',serif" font-size="${size*0.028}" letter-spacing=".15em" fill="rgba(212,175,106,.6)">${g.l}</text>`;
  });
  s += `<circle cx="${cx}" cy="${cy}" r="${rC-4}" fill="url(#lm-core)"/>`+
       `<text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="central" font-family="'Ma Shan Zheng',serif" font-size="${size*0.10}" fill="#0d0608">太</text>`;
  for (let i=0;i<56;i++){ const a=(i*(360/56)-90)*Math.PI/180;
    const x1=cx+Math.cos(a)*(rO+2), y1=cy+Math.sin(a)*(rO+2);
    const x2=cx+Math.cos(a)*(rO+(i%7===0?7:4)), y2=cy+Math.sin(a)*(rO+(i%7===0?7:4));
    s += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="rgba(212,175,106,.45)" stroke-width="${i%7===0?0.9:0.5}"/>`;
  }
  s += `</svg>`;
  return s;
}

/* Galaxy */
function buildGalaxy(size) {
  let s = `<svg viewBox="0 0 400 400" width="${size}" height="${size}" style="display:block"><defs>`+
    `<radialGradient id="gxy-core" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#f0e6d2" stop-opacity="1"/><stop offset="15%" stop-color="#e8c878" stop-opacity=".85"/><stop offset="40%" stop-color="#d4af6a" stop-opacity=".4"/><stop offset="100%" stop-color="#d4af6a" stop-opacity="0"/></radialGradient>`+
    `<radialGradient id="gxy-halo" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#5a1822" stop-opacity="0"/><stop offset="50%" stop-color="#5a1822" stop-opacity=".35"/><stop offset="100%" stop-color="#0d0608" stop-opacity="0"/></radialGradient></defs>`+
    `<circle cx="200" cy="200" r="180" fill="url(#gxy-halo)"/>`;
  s += `<g fill="none" stroke="#d4af6a" stroke-width="1.2" stroke-linecap="round">`;
  for (let i=0;i<5;i++){ const rot=i*72;
    s += `<path d="M 200 200 Q 260 150 280 200 Q 290 270 220 290 Q 150 290 130 230 Q 120 180 180 165" transform="rotate(${rot} 200 200)" opacity="${0.18+0.06*(i%3)}"/>`;
  }
  s += `</g><g fill="#d4af6a">`;
  for (let i=0;i<60;i++){ const a=i*0.32, r=30+i*2.6;
    const x=200+Math.cos(a)*r, y=200+Math.sin(a)*r;
    const op=Math.max(0.1,0.9-i*0.013), rad=0.4+(i%5===0?0.5:0);
    s += `<circle cx="${x}" cy="${y}" r="${rad}" opacity="${op}"/>`;
  }
  for (let i=0;i<60;i++){ const a=Math.PI+i*0.32, r=30+i*2.6;
    const x=200+Math.cos(a)*r, y=200+Math.sin(a)*r;
    const op=Math.max(0.1,0.9-i*0.013), rad=0.4+(i%5===0?0.5:0);
    s += `<circle cx="${x}" cy="${y}" r="${rad}" opacity="${op}" fill="#f0e6d2"/>`;
  }
  s += `</g><circle cx="200" cy="200" r="50" fill="url(#gxy-core)"/><circle cx="200" cy="200" r="6" fill="#f0e6d2"/></svg>`;
  return s;
}

/* Mountain scene with optional lantern */
function buildMountain(height, withLantern) {
  let s = `<svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMax slice" width="100%" height="${height}" style="display:block"><defs>`+
    `<linearGradient id="sky-grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#1a0810" stop-opacity="0"/><stop offset="80%" stop-color="#1a0810" stop-opacity=".65"/><stop offset="100%" stop-color="#0d0608" stop-opacity=".95"/></linearGradient>`+
    `<linearGradient id="mt-far" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#2a0a14"/><stop offset="100%" stop-color="#1a0810"/></linearGradient>`+
    `<linearGradient id="mt-mid" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#1a0810"/><stop offset="100%" stop-color="#0d0608"/></linearGradient>`+
    `<linearGradient id="mt-near" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0d0608"/><stop offset="100%" stop-color="#050204"/></linearGradient>`+
    `<radialGradient id="moon-g" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#f0e6d2" stop-opacity=".7"/><stop offset="50%" stop-color="#d4af6a" stop-opacity=".18"/><stop offset="100%" stop-color="#d4af6a" stop-opacity="0"/></radialGradient>`+
    `<radialGradient id="lantern-g" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#ffd066" stop-opacity=".95"/><stop offset="30%" stop-color="#e8a040" stop-opacity=".6"/><stop offset="100%" stop-color="#a04a18" stop-opacity="0"/></radialGradient></defs>`+
    `<rect width="400" height="240" fill="url(#sky-grad)"/>`+
    `<circle cx="310" cy="60" r="42" fill="url(#moon-g)"/><circle cx="310" cy="60" r="14" fill="#f0e6d2" opacity=".18"/>`+
    `<path d="M0 160 L40 130 L80 145 L120 110 L160 130 L200 100 L240 120 L290 90 L340 115 L400 100 L400 240 L0 240 Z" fill="url(#mt-far)" opacity=".7"/>`+
    `<rect x="0" y="120" width="400" height="60" fill="#1a0810" opacity=".45"/>`+
    `<path d="M-20 180 L30 150 L70 170 L120 140 L170 160 L220 130 L280 155 L340 135 L400 160 L400 240 L-20 240 Z" fill="url(#mt-mid)" opacity=".85"/>`+
    `<path d="M-10 210 L40 185 L90 205 L140 175 L200 200 L260 180 L320 200 L400 185 L400 240 L-10 240 Z" fill="url(#mt-near)"/>`;
  if (withLantern) {
    s += `<g><circle cx="200" cy="218" r="38" fill="url(#lantern-g)"/><circle cx="200" cy="218" r="4" fill="#ffd066"/></g>`;
  }
  s += `<g opacity=".4">`;
  for (let i=0;i<18;i++){ const x=(i*23+11)%400, y=130+((i*7)%70);
    s += `<circle cx="${x}" cy="${y}" r=".6" fill="#d4af6a"/>`;
  }
  s += `</g></svg>`;
  return s;
}

/* Sun Radiant (36 rays + glowing core) */
function buildSunRadiant(size) {
  let s = `<svg viewBox="0 0 400 400" width="${size}" height="${size}" style="display:block"><defs>`+
    `<radialGradient id="sun-core" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#f0e6d2" stop-opacity=".95"/><stop offset="20%" stop-color="#e8c878" stop-opacity=".7"/><stop offset="55%" stop-color="#d4af6a" stop-opacity=".25"/><stop offset="100%" stop-color="#d4af6a" stop-opacity="0"/></radialGradient></defs>`+
    `<g stroke="#d4af6a" stroke-opacity=".4" stroke-width=".6">`;
  for (let i=0;i<36;i++){ const a=(i*10)*Math.PI/180, r1=50, r2=180;
    const x1=200+Math.cos(a)*r1, y1=200+Math.sin(a)*r1;
    const x2=200+Math.cos(a)*r2, y2=200+Math.sin(a)*r2;
    s += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" opacity="${i%2?0.5:1}"/>`;
  }
  s += `</g><circle cx="200" cy="200" r="70" fill="url(#sun-core)"/><circle cx="200" cy="200" r="20" fill="#f0e6d2" opacity=".6"/></svg>`;
  return s;
}

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
  }
  function clearError() { err.classList.remove("show"); err.textContent = ""; }

  // ---- 단계형 위저드 ----
  const panels = Array.from(form.querySelectorAll(".step-panel"));
  const total = panels.length;
  const countEl = document.getElementById("stepCount");
  const prevBtn = document.getElementById("stepPrev");
  const nextBtn = document.getElementById("stepNext");
  const submitBtn = document.getElementById("stepSubmit");
  let cur = 0;

  // 각 단계 필수값 검증 (해당 단계에서 "다음" 누를 때)
  function validateStep(i) {
    const step = i + 1;
    if (step === 1 && !form.querySelector("#ap-name").value.trim())
      return "이름을 입력해 주세요.";
    if (step === 2 && !(form.querySelector('input[name="gender"]:checked')))
      return "성별을 선택해 주세요.";
    if (step === 3 && !form.querySelector("#ap-birth").value)
      return "생년월일을 입력해 주세요.";
    if (step === 4 && !(form.querySelector('input[name="cal"]:checked')))
      return "양력 / 음력을 선택해 주세요.";
    return null;
  }

  function render() {
    panels.forEach(function (p, i) { p.hidden = (i !== cur); });
    if (countEl) countEl.textContent = (cur + 1) + " / " + total;
    prevBtn.hidden = (cur === 0);
    const last = (cur === total - 1);
    nextBtn.hidden = last;
    submitBtn.hidden = !last;
    // 현재 패널 첫 입력에 포커스
    const firstInput = panels[cur].querySelector("input[type=text], input[type=date], select, textarea");
    if (firstInput) { try { firstInput.focus({ preventScroll: true }); } catch (e) {} }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  nextBtn.addEventListener("click", function () {
    clearError();
    const msg = validateStep(cur);
    if (msg) return showError(msg);
    if (cur < total - 1) { cur++; render(); }
  });
  prevBtn.addEventListener("click", function () {
    clearError();
    if (cur > 0) { cur--; render(); }
  });

  // 라디오 선택 시 자동으로 다음 단계로 (성별·양음력처럼 선택형)
  ["gender", "cal"].forEach(function (nm) {
    form.querySelectorAll('input[name="' + nm + '"]').forEach(function (r) {
      r.addEventListener("change", function () {
        clearError();
        setTimeout(function () { if (cur < total - 1) { cur++; render(); } }, 200);
      });
    });
  });
  // Enter 키로 다음 (textarea 제외)
  form.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
      e.preventDefault();
      if (!submitBtn.hidden) { form.requestSubmit ? form.requestSubmit() : nextBtn.click(); }
      else nextBtn.click();
    }
  });

  render();

  // ---- 최종 제출 ----
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    clearError();

    // 안전: 모든 필수 단계 재검증
    for (var i = 0; i < total; i++) {
      var m = validateStep(i);
      if (m) { cur = i; render(); return showError(m); }
    }

    const data = {
      product: (form.querySelector('input[name="product"]:checked') || form.querySelector('input[name="product"]') || {}).value || "카톡에서 상담 예정",
      name: form.querySelector("#ap-name").value.trim(),
      gender: (form.querySelector('input[name="gender"]:checked') || {}).value || "",
      birth: form.querySelector("#ap-birth").value,
      cal: (form.querySelector('input[name="cal"]:checked') || {}).value || "",
      timeKnow: form.querySelector("#ap-time-know").value,
      time: form.querySelector("#ap-time").value.trim(),
      topics: Array.from(form.querySelectorAll('input[name="topics"]:checked')).map(function (c) { return c.value; }),
      worry: form.querySelector("#ap-worry").value.trim(),
      contact: form.querySelector("#ap-contact").value.trim(),
      createdAt: new Date().toISOString()
    };

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
  // 0) 메타 픽셀 전환 이벤트 — 신청 제출 = CompleteRegistration(등록 완료)
  try { if (window.fbq) fbq('track', 'CompleteRegistration', { content_name: data.product || '' }); } catch (e) {}

  // 1) 로컬 저장 (완료 페이지 요약용)
  try { localStorage.setItem(CONFIG.storeKey, JSON.stringify(data)); } catch (e) {}

  // 2) 구글 시트로 전송 (Apps Script 웹앱)
  //    no-cors + text/plain 으로 보내 CORS/프리플라이트 회피.
  //    전송 성공 여부와 무관하게 항상 다음 단계로 진행(고객 경험 우선).
  if (CONFIG.SHEET_URL && CONFIG.SHEET_URL.indexOf("script.google.com") !== -1) {
    try {
      fetch(CONFIG.SHEET_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(data)
      }).catch(function () {});
    } catch (e) {}
  }

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
  // 메타 픽셀 전환 이벤트 — 카톡 연결 클릭 = Contact
  kakaoBtn.addEventListener("click", function () {
    try { if (window.fbq) fbq('track', 'Contact'); } catch (e) {}
  });

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
