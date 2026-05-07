---
name: mock-ui
description: 자연어 요구사항으로 단일 화면 Mock UI를 생성하고 Vercel에 배포합니다. VERCEL_TOKEN 환경변수가 필요합니다.
argument-hint: <화면 요구사항 설명>
---

사용자의 화면 요구사항을 기반으로 Mock UI를 생성하고 Vercel에 배포합니다.

**사용자 요구사항**: $ARGUMENTS

요구사항이 없거나 너무 짧으면 사용자에게 구체적인 화면 설명을 요청하세요.

Agent tool을 사용해 `mock-ui-builder` 서브에이전트를 다음 프롬프트로 디스패치하세요:

```
다음 요구사항에 맞는 Mock UI를 생성하고 Vercel에 배포해주세요:

$ARGUMENTS
```

서브에이전트가 완료되면 결과(URL, 로컬 경로, 키트 확장 제안)를 사용자에게 보고합니다.
