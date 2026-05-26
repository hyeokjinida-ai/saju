# 명운록 · 사주 리포트 랜딩 (MVP)

> 삶의 흐름을 기록한 사주 리포트

메타광고 유입 고객이 **랜딩 → 신청 폼 → 카카오톡 연결**로 이어지는 전환형 정적 사이트입니다.
빌드 도구 없이 동작하는 순수 HTML/CSS/JS이며, 결제·상담은 카카오톡에서 진행합니다.

## 페이지 구조
- `/` (`index.html`) — 랜딩 (히어로~최종 CTA, 13섹션 + 모바일 고정 CTA)
- `/apply` (`apply/index.html`) — 신청 폼 (상품 선택 + 정보 입력)
- `/thanks` (`thanks/index.html`) — 신청 완료 + 카카오톡 연결 + 입력 요약
- `css/landing.css` — 디자인 (딥네이비/한지크림/골드, Noto Serif·Sans KR)
- `js/landing.js` — 설정 상수 · 폼 검증/저장 · 카톡 연결
- `images/` — 배경 이미지 (`hero.jpg` 사용)

## 자주 바꾸는 값 — 모두 `js/landing.js` 상단 `CONFIG`
```js
const CONFIG = {
  brand: "명운록",
  KAKAO_CHAT_URL: "https://open.kakao.com/o/...",   // 카카오톡 링크
  products: {
    basic:         { name: "명운록 기본 사주 리포트",   price: 19000 },
    premium:       { name: "명운록 프리미엄 사주 리포트", price: 39000 },
    comprehensive: { name: "명운록 종합 사주 리포트",   price: 79000 }, // 추후 확장
  },
};
```
- **카카오톡 링크**: `CONFIG.KAKAO_CHAT_URL` 한 줄
- **상품명/가격(동작)**: `CONFIG.products`
- **화면 표기 가격**: `index.html`·`apply/index.html`에서 `19,000`/`39,000` 검색해 수정

## 신청 데이터 백엔드 연결
`js/landing.js`의 **`submitApplication(data)`** 함수 하나만 수정.
현재는 `localStorage` 저장만 하며, 주석 처리된 `fetch(...)`에 엔드포인트(Supabase/Google Sheet/Airtable 등)를 넣으면 됩니다.

## 미리보기 / 배포
- 정적 사이트라 빌드 불필요. 로컬은 임의 정적 서버로 폴더를 열면 됩니다.
- 배포: GitHub `main` 푸시 → Vercel 자동 배포.

## 이미지 교체
`images/` 폴더에 같은 이름으로 파일을 넣으면 자동 반영됩니다. (없으면 CSS 그라데이션 폴백)
