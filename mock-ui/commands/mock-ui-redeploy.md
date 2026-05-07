---
name: mock-ui-redeploy
description: 로컬에서 수정한 Mock UI를 동일한 Vercel 프로젝트에 재배포합니다. Usage: /mock-ui-redeploy <slug>
argument-hint: <slug> (예: 2026-05-07-signup-a3f)
---

slug: **$ARGUMENTS**

로컬 아카이브의 코드를 수정한 뒤 Vercel에 재배포합니다.

1. 플러그인 루트를 찾습니다:

```bash
PLUGIN_ROOT="${CLAUDE_PLUGIN_ROOT:-$(find ~/.claude/plugins -path "*/mock-ui/.claude-plugin/plugin.json" 2>/dev/null | sed 's|/.claude-plugin/plugin.json||' | head -1)}"
```

2. slug의 메타데이터를 조회합니다:

```bash
node "$PLUGIN_ROOT/scripts/archive.js" metadata $ARGUMENTS
```

메타데이터에서 `archivePath`를 추출합니다. 해당 slug를 찾을 수 없으면 오류를 안내하고 `/mock-ui-list`로 사용 가능한 목록을 확인하도록 안내합니다.

3. 재배포합니다:

```bash
node "$PLUGIN_ROOT/scripts/deploy.js" <archivePath>
```

4. 새 배포 URL을 사용자에게 보고합니다.
