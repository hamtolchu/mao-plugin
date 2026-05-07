# mock-ui — Claude Code Plugin

사내 디자인 규칙과 컴포넌트 키트를 기반으로 단일 화면 Mock UI를 생성하고 Vercel에 배포하는 Claude Code 플러그인입니다.

---

## 요구 사항

- Claude Code CLI 설치됨
- Node.js 18 이상
- [Vercel CLI](https://vercel.com/cli) 전역 설치: `npm install -g vercel`
- 개인 Vercel 계정 및 토큰

---

## 1단계: Vercel 토큰 발급

1. [vercel.com/account/tokens](https://vercel.com/account/tokens) 접속
2. **Create Token** 클릭 → 이름 입력 (예: `mock-ui-plugin`)
3. 발급된 토큰을 복사

---

## 2단계: 환경변수 설정

터미널 프로파일(`.zshenv`, `.zshrc`, `.bashrc` 등)에 추가:

```bash
export VERCEL_TOKEN="your_token_here"
```

변경 반영:

```bash
source ~/.zshenv  # 또는 새 터미널 열기
```

---

## 3단계: 플러그인 설치

Claude Code 안에서 다음을 실행합니다.

```
/plugin marketplace add hamtolchu/mao-plugin
/plugin install mock-ui@mao-plugin
```

설치 후 Claude Code를 재시작하면 `/mock-ui` 커맨드가 활성화됩니다.

---

## 사용법

### Mock UI 생성

```
/mock-ui 회원가입 화면 — 이메일, 비밀번호 입력 + 약관 동의 체크박스 + 가입 버튼
```

```
/mock-ui 상품 목록 페이지 — 상단 필터바, 격자형 카드 리스트, 페이지네이션
```

```
/mock-ui 마이페이지 — 좌측 사이드바 네비게이션 + 우측 프로필 정보 편집 폼
```

성공 시 결과:
```
✓ Mock UI 생성 완료

URL:    https://mock-2026-05-07-signup-a3f.vercel.app
Local:  ~/.mock-ui-archive/2026-05-07-signup-a3f/
```

### 생성 목록 조회

```
/mock-ui-list
```

### 로컬 수정 후 재배포

로컬 아카이브의 코드를 수정한 뒤:

```
/mock-ui-redeploy 2026-05-07-signup-a3f
```

---

## 로컬 아카이브

생성된 Mock은 `~/.mock-ui-archive/<slug>/`에 보존됩니다.

- 각 Mock은 독립적인 Next.js 프로젝트입니다
- 개발자가 코드를 직접 열어 실제 프로젝트로 이식할 수 있습니다
- Vercel 프로젝트 정리는 [Vercel 대시보드](https://vercel.com/dashboard)에서 수동으로 합니다

---

## 디자인 시스템

`boilerplate/`에 SEG Admin 디자인 시스템이 내장되어 있습니다:

- **DESIGN.md**: 딥 바이올렛 브랜드, Pretendard 폰트, Radix UI 스타일 원칙
- **COMPONENTS.md**: 실제 컴포넌트 카탈로그 (Button, DataTable, Topbar, Card 등 40+)
- **스택**: Next.js 16 + Tailwind CSS v4 + Radix UI

디자인 시스템 업데이트 시: `boilerplate/` 내용을 교체하고 플러그인을 재설치하세요.

---

## 트러블슈팅

**VERCEL_TOKEN 오류**: `echo $VERCEL_TOKEN`으로 설정 여부 확인. 새 터미널에서 재시도.

**vercel 커맨드 없음**: `npm install -g vercel` 실행.

**빌드 실패**: `~/.mock-ui-archive/<slug>/` 경로를 열어 `npm run build` 직접 실행해 에러 확인.

**플러그인 위치 탐지 실패**: `find ~/.claude/plugins -name "mock-ui-builder.md"` 로 설치 경로 확인.
