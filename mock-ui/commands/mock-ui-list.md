---
name: mock-ui-list
description: 지금까지 생성한 Mock UI 목록을 최신순으로 보여줍니다 (로컬 아카이브 기준)
---

로컬 아카이브(`~/.mock-ui-archive/`)에서 생성된 Mock UI 목록을 가져옵니다.

1. 플러그인 루트를 찾습니다:

```bash
PLUGIN_ROOT="${CLAUDE_PLUGIN_ROOT:-$(find ~/.claude/plugins -path "*/mock-ui/.claude-plugin/plugin.json" 2>/dev/null | sed 's|/.claude-plugin/plugin.json||' | head -1)}"
echo "Plugin root: $PLUGIN_ROOT"
```

2. 아카이브 목록을 조회합니다:

```bash
node "$PLUGIN_ROOT/scripts/archive.js" list
```

3. JSON 결과를 파싱해 아래 형식의 표로 출력합니다:

| Slug | URL | 생성 일시 | 로컬 경로 |
|------|-----|-----------|-----------|

아카이브가 비어 있거나 `~/.mock-ui-archive/`가 없으면 "생성된 mock이 없습니다. `/mock-ui <설명>`으로 시작하세요."라고 안내합니다.
