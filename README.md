# Kurly Design Base — Claude Code Marketplace

Kurly Design Base 팀의 Claude Code 플러그인 마켓플레이스입니다.

## 포함 플러그인

| 플러그인 | 설명 |
|---|---|
| `mock-ui` | 자연어 설명으로 단일 화면 Mock UI를 생성하고 Vercel에 배포 |

## 설치

```
/plugin marketplace add <owner>/design-base
/plugin install mock-ui@design-base
```

## mock-ui 사용 전 준비

`VERCEL_TOKEN` 환경변수가 필요합니다:

```bash
export VERCEL_TOKEN=your_vercel_token_here
```

## 사용법

```
/mock-ui "주문 내역을 보여주는 관리자 페이지. 날짜 필터, 상태별 탭, 테이블 형식."
```

실행 시 [mao-startkit](https://github.com/hamtolchu/mao-startkit)을 가져와 빌드 후 Vercel URL을 반환합니다.

## 기타 명령어

- `/mock-ui-list` — 생성된 Mock UI 목록 조회
- `/mock-ui-redeploy <slug>` — 기존 Mock UI 재배포
