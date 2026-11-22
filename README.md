# 오토리(Autori) 홈페이지

순수 정적 HTML·CSS·JS로 만든 **오토리(Autori)** 원페이지 회사 홈페이지입니다.
빌드 도구, 프레임워크, 서버, 데이터베이스, 분석 스크립트, 쿠키 배너 없이 그대로 GitHub Pages나 Netlify에 올릴 수 있습니다.

## 파일 구성

- `index.html` — 전체 페이지 구조 및 카피
- `styles.css` — 디자인 토큰, 레이아웃, 반응형 스타일 (Pretendard CDN 불러오기 한 곳 포함)
- `script.js` — 모바일 메뉴 토글, 미입력 크몽 링크 숨김, 없는 로고/화면 이미지 대체 처리
- `assets/logo/` — 로고 이미지 파일 폴더
- `assets/screens/` — 실제 프로그램·보고서 캡처 이미지 폴더
- `assets/og.png` — 링크 공유(Open Graph) 대표 이미지 자리

---

## 1. 남은 `【 】` 빈칸 목록

아래 항목은 확인·승인이 끝난 뒤 `index.html`에서 직접 채워 넣습니다.

| 항목 | 위치 (`index.html`) | 비고 |
|---|---|---|
| `【크몽 서비스 주소 — 승인 대기 중】` | `#pricing` 구간 `data-kmong-link`의 `href` 속성 | 승인 전까지는 `script.js`가 링크를 자동으로 숨깁니다. 실제 `https://...` 주소를 넣으면 바로 표시됩니다. |
| `【공개할 사업자 정보: 상호·대표자·사업자등록번호】` | `footer` 바닥글 `.footer-meta` | 통신판매업·사업자 정보 공개 시 채워 넣습니다. |
| `【이용약관·개인정보처리방침 링크】` | `footer` 바닥글 `.footer-meta` | 약관·개인정보처리방침 페이지 준비 후 링크(`<a>`)로 교체합니다. |

---

## 2. 바꿔 넣을 이미지 목록

이미지가 아직 없을 때는 로고는 Pretendard 700 글자("오토리")로, 주요 제품 화면은 점선 자리 상자로, 도입 순서 단계 화면(`step-1.png`~`step-5.png`)은 숨김 상태로 동작합니다. 아래 경로에 파일을 넣으면 코드 수정 없이 자동으로 표시됩니다.

| 파일 경로 | 들어갈 자리 | 권장 크기 (px) | 비고 |
|---|---|---|---|
| `assets/logo/logo-mark-dark-bg.png` | 원본 (대표 제공 매듭 마크, 남색 바탕 800×800) | — | 2026-11-23 받음. 수정하지 않고 보관 |
| `assets/logo/logo-lockup-light-bg.png` | 머리글(높이 34px)·바닥글(높이 30px) | 537×168, 투명 PNG | 로고 시트(`../로고/web_logo_preview.png`) 왼쪽에서 잘라 흰 바탕만 투명하게. 색 변경 없음 |
| `assets/logo/logo-lockup-dark-bg.png` | 남색 바탕용 보관, OG 이미지 재료 | 537×168 | 로고 시트 오른쪽에서 자름 |
| `assets/logo/app-icon.png`, `assets/favicon.png`, `assets/apple-touch-icon.png` | 앱 아이콘 원본, 브라우저 탭, 휴대폰 홈 화면 | 181, 64, 180 | 로고 시트의 둥근 남색 아이콘 |
| `assets/og.png` | 링크 공유 미리보기 | 1200×630 | 남색 바탕 + 남색용 로고. 만들어 둠 |
| `assets/screens/hero-inbox.png` | `#hero` 첫 화면 오른쪽 카드 | 1200 × 800 (3:2 비율, PNG) | 제각각인 엑셀이 쌓인 실제 메일함 캡처 |
| `assets/screens/report-summary.png` | `#how` 해결 방법 구간 오른쪽 | 1200 × 800 (3:2 비율, PNG) | 자동 생성된 취합 보고서 요약 시트 실제 캡처 |
| `assets/screens/report-sheets.png` | `#tests` 시험 기록 구간 오른쪽 | 1200 × 800 (3:2 비율, PNG) | 보고서 엑셀 1개, 시트 6장 구성 실제 캡처 |
| `assets/screens/step-1.png` | `#steps` 1단계 (무료 확인) 옆 | 600 × 400 (3:2 비율, PNG) | 선택 항목 (파일이 없으면 숨김) |
| `assets/screens/step-2.png` | `#steps` 2단계 (원격 설치) 옆 | 600 × 400 (3:2 비율, PNG) | 선택 항목 (파일이 없으면 숨김) |
| `assets/screens/step-3.png` | `#steps` 3단계 (2주 병행 운영) 옆 | 600 × 400 (3:2 비율, PNG) | 선택 항목 (파일이 없으면 숨김) |
| `assets/screens/step-4.png` | `#steps` 4단계 (메일 자동 가져오기) 옆 | 600 × 400 (3:2 비율, PNG) | 선택 항목 (파일이 없으면 숨김) |
| `assets/screens/step-5.png` | `#steps` 5단계 (보고서 공유) 옆 | 600 × 400 (3:2 비율, PNG) | 선택 항목 (파일이 없으면 숨김) |

---

## 3. 글꼴을 직접 호스팅으로 바꾸는 방법

현재 `styles.css` 맨 위 2번째 줄 한 곳에서만 Pretendard CDN을 불러옵니다.
나중에 `assets/fonts/`에 직접 올린 `woff2` 파일로 바꾸려면 `styles.css`의 `@import` 한 줄만 `@font-face` 선언으로 교체하면 됩니다.

---

## 4. 올리는 방법 (배포)

### 방법 A: GitHub Pages
1. GitHub에 새 저장소(Repository)를 만들고 이 폴더의 파일(`index.html`, `styles.css`, `script.js`, `assets/`, `README.md`)을 올립니다.
2. 저장소 **Settings → Pages**로 이동합니다.
3. **Build and deployment → Source**에서 `Deploy from a branch`를 선택하고, `main` 브랜치의 `/ (root)`를 선택한 뒤 **Save**를 누릅니다.
4. 몇 분 뒤 표시되는 `https://<계정>.github.io/<저장소>/` 주소에서 바로 확인할 수 있습니다.

### 방법 B: Netlify
1. [Netlify](https://app.netlify.com/)에 로그인합니다.
2. **Add new site → Deploy manually**를 선택하고, 이 폴더 전체를 그대로 끌어다 놓습니다(또는 GitHub 저장소를 연결하고 Build command 비움, Publish directory `.` 지정).
3. 업로드가 끝나면 즉시 배포 주소가 생성되며, 필요 시 보유한 도메인을 연결할 수 있습니다.
