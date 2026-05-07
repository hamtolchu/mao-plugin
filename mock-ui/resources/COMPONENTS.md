# COMPONENTS.md — SEG Admin 컴포넌트 카탈로그

> **AI 에이전트용 가이드**. `mock-ui-builder`가 화면을 구성할 때 이 카탈로그를 참조합니다.
> 반드시 이 목록의 컴포넌트를 우선 사용하고, 없을 때만 페이지 내부 ad-hoc 컴포넌트를 만드세요.

---

## 레이아웃 원칙 (화면 구성 전 숙지)

- **페이지 배경**: `bg-neutral-100` — 항상 페이지 최외곽 배경에 사용
- **카드**: `bg-surface border border-neutral-200 rounded-xl` — 콘텐츠 컨테이너
- **중첩 컨테이너**: `bg-neutral-50 border border-neutral-200 rounded-lg` — 카드 내부 그룹
- **3단 색상 계층** 유지: neutral-100(배경) → surface(카드) → neutral-50(중첩)
- **탑바 레이아웃**: Topbar 고정 후 나머지를 flex-col로 채움
- **사이드바 레이아웃**: `flex h-screen` → Sidebar 220px + 나머지 콘텐츠 영역

---

## 1. 레이아웃 컴포넌트

### Topbar
**위치**: `@/components/ui/topbar`  
**언제**: 모든 화면 최상단. 탑바 레이아웃 모드와 사이드바 레이아웃 모두 사용.
```tsx
import { Topbar } from '@/components/ui/topbar'
<Topbar
  logo={<span className="text-sm font-semibold text-primary-on">SEG Admin</span>}
  actions={<Button variant="ghost" size="sm" className="text-primary-on">로그아웃</Button>}
/>
```

### StickyActionBar
**위치**: `@/components/ui/sticky-action-bar`  
**언제**: 멀티스텝 폼의 하단 고정 액션 바. 64px 고정 높이. 좌측 취소/이전, 우측 다음/저장.
```tsx
import { StickyActionBar } from '@/components/ui/sticky-action-bar'
<StickyActionBar>
  <Button variant="ghost">취소</Button>
  <div className="flex gap-2">
    <Button variant="secondary">Draft 저장</Button>
    <Button variant="primary">다음 단계</Button>
  </div>
</StickyActionBar>
```

### Sidebar
**위치**: `@/components/ui/sidebar`  
**언제**: 속성 관리 등 사이드바 레이아웃. 220px 고정 폭. Topbar와 함께 사용.

---

## 2. 인터랙티브 기본 컴포넌트

### Button
**위치**: `@/components/ui/button`  
**variant**: `primary` (가장 중요한 단일 액션) | `secondary` (보조 액션) | `ghost` (취소, 이전) | `danger` (삭제 등 비가역적 액션)  
**size**: `md` (기본 36px) | `sm` (28px) | `icon` (36×36px)  
**규칙**: `primary` 버튼은 화면당 하나만.
```tsx
import { Button } from '@/components/ui/button'
<Button variant="primary" size="md">저장 및 활성화</Button>
<Button variant="ghost" size="md">취소</Button>
<Button variant="danger" size="md">삭제</Button>
```

### Input
**위치**: `@/components/ui/input`  
**특이사항**: `showCount` + `maxLength` 조합으로 글자 수 카운터 표시 가능.
```tsx
import { Input } from '@/components/ui/input'
<Input placeholder="세그먼트 이름" />
<Input showCount maxLength={50} placeholder="최대 50자" />
```

### Textarea
**위치**: `@/components/ui/textarea`  
**언제**: 여러 줄 입력 필드.
```tsx
import { Textarea } from '@/components/ui/textarea'
<Textarea placeholder="설명을 입력하세요" rows={3} />
```

### Select
**위치**: `@/components/ui/select`  
**언제**: 단일 선택 드롭다운. Radix UI 기반.
```tsx
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
<Select>
  <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
  <SelectContent>
    <SelectItem value="a">옵션 A</SelectItem>
    <SelectItem value="b">옵션 B</SelectItem>
  </SelectContent>
</Select>
```

### Combobox
**위치**: `@/components/ui/combobox`  
**언제**: 검색 가능한 단일 선택. Select보다 항목이 많을 때.

### MultiCombobox
**위치**: `@/components/ui/multi-combobox`  
**언제**: 검색 가능한 다중 선택 (태그 형태로 표시).

### Checkbox
**위치**: `@/components/ui/checkbox`
```tsx
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
<div className="flex items-center gap-2">
  <Checkbox id="agree" />
  <Label htmlFor="agree">이용약관에 동의합니다</Label>
</div>
```

### RadioGroup
**위치**: `@/components/ui/radio-group`
```tsx
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
<RadioGroup defaultValue="batch">
  <div className="flex items-center gap-2">
    <RadioGroupItem value="batch" id="batch" />
    <Label htmlFor="batch">Batch</Label>
  </div>
</RadioGroup>
```

### Switch
**위치**: `@/components/ui/switch`  
**언제**: 활성화/비활성화 토글.

### SegmentedControl
**위치**: `@/components/ui/segmented-control`  
**언제**: 2–4개 선택지 탭 형태. Tabs보다 작은 범위의 전환.

### Tabs
**위치**: `@/components/ui/tabs`  
**언제**: 큰 콘텐츠 섹션 전환. `Tabs > TabsList > TabsTrigger + TabsContent` 구조.

---

## 3. 데이터 표시

### DataTable
**위치**: `@/components/ui/data-table`  
**언제**: 목록 화면 필수. 정렬, 로딩 스켈레톤, 빈 상태, 페이지네이션 내장.
```tsx
import { DataTable } from '@/components/ui/data-table'
import type { Column } from '@/components/ui/data-table'

type Segment = { id: string; name: string; status: string; count: number }
const columns: Column<Segment>[] = [
  { key: 'name', header: '세그먼트명', sortable: true, cell: (row) => row.name },
  { key: 'status', header: '상태', cell: (row) => <Badge variant={row.status === 'active' ? 'active' : 'inactive'}>{row.status}</Badge> },
  { key: 'count', header: '사용자 수', sortable: true, cell: (row) => row.count.toLocaleString() },
]
<DataTable
  data={segments}
  columns={columns}
  keyExtractor={(row) => row.id}
  isLoading={false}
  pageSize={20}
  page={1}
  totalCount={143}
  onPageChange={(p) => console.log(p)}
/>
```

### Card / CardHeader / CardContent / CardFooter
**위치**: `@/components/ui/card`  
**언제**: 모든 콘텐츠 컨테이너. rounded-xl + surface 배경 + neutral-200 border 자동 적용.
```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
<Card>
  <CardHeader>
    <CardTitle>SEG 기본 정보</CardTitle>
    <CardDescription>세그먼트의 기본 설정을 입력하세요.</CardDescription>
  </CardHeader>
  <CardContent>...</CardContent>
</Card>
```

### Badge
**위치**: `@/components/ui/badge`  
**variant**: `active` (초록) | `inactive` (회색) | `warning` (앰버) | `error` (빨강) | `info` (파랑) | `default` (회색)  
**규칙**: 상태 표시 전용. 의미 없는 장식 사용 금지.
```tsx
import { Badge } from '@/components/ui/badge'
<Badge variant="active">활성화</Badge>
<Badge variant="error">오류</Badge>
```

### Tag
**위치**: `@/components/ui/tag`  
**언제**: 분류 태그 (CRM, 담당팀 등). primary-subtle 배경 + primary-light 텍스트.
```tsx
import { Tag } from '@/components/ui/tag'
<Tag>CRM</Tag>
<Tag>마케팅</Tag>
```

### TypeBadge
**위치**: `@/components/ui/type-badge`  
**언제**: Attribute 타입 표시 전용. type: `'STRING' | 'NUMBER' | 'BOOLEAN' | 'DATETIME' | 'STRING_LIST'`

### CodeText
**위치**: `@/components/ui/code-text`  
**언제**: Attribute Key 등 코드성 식별자. JetBrains Mono 폰트 + primary-light 색상.
```tsx
import { CodeText } from '@/components/ui/code-text'
<CodeText>total_purchase_amount</CodeText>
```

### DefinitionList
**위치**: `@/components/ui/definition-list`  
**언제**: 키-값 정보 목록 (상세 페이지 메타데이터 등).

### Stat
**위치**: `@/components/ui/stat`  
**언제**: 수치 통계 카드. 대시보드, KPI 표시.

### IndicatorDot
**위치**: `@/components/ui/indicator-dot`  
**언제**: Batch(파랑)/Live(초록) 세그먼트 실행 모드 표시.

### Progress
**위치**: `@/components/ui/progress`

### Skeleton
**위치**: `@/components/ui/skeleton`  
**언제**: 로딩 상태. DataTable의 isLoading이 자동 처리하므로, 개별 영역에만 사용.

### Spinner
**위치**: `@/components/ui/spinner`

---

## 4. 피드백 & 알림

### Callout
**위치**: `@/components/ui/callout`  
**variant**: `info` | `error` | `warning` | `success`  
**언제**: 화면 내 중요 안내 메시지. Toast 대신 인라인으로 표시해야 할 때.
```tsx
import { Callout } from '@/components/ui/callout'
import { InfoIcon } from 'lucide-react'
<Callout variant="info" icon={<InfoIcon className="w-4 h-4" />}>
  세그먼트 활성화 후에는 조건을 수정할 수 없습니다.
</Callout>
```

### EmptyState
**위치**: `@/components/ui/empty-state`  
**언제**: 데이터가 없을 때. DataTable의 emptyState prop에 전달하거나 단독 사용.

---

## 5. 내비게이션 & 오버레이

### StepIndicator
**위치**: `@/components/ui/step-indicator`  
**언제**: 멀티스텝 폼 진행 표시. StickyActionBar와 세트로 사용.
```tsx
import { StepIndicator } from '@/components/ui/step-indicator'
<StepIndicator
  steps={[{ label: '기본 정보' }, { label: '조건 설정' }, { label: '검토' }]}
  currentStep={1}
/>
```

### Breadcrumb
**위치**: `@/components/ui/breadcrumb`  
**언제**: 상세 페이지 상단 경로 표시.

### Tabs
이미 섹션 2에 기술됨.

### Dialog
**위치**: `@/components/ui/dialog`  
**언제**: 확인/취소가 필요한 모달. 삭제 확인, 상세 정보 팝업.
```tsx
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
```

### Drawer
**위치**: `@/components/ui/drawer`  
**언제**: 오른쪽에서 슬라이드 인 패널. 상세 편집 폼.

### Popover
**위치**: `@/components/ui/popover`  
**언제**: 앵커에 붙는 부유 패널 (달력 팝오버, 필터 드롭다운 등).

### DropdownMenu
**위치**: `@/components/ui/dropdown-menu`  
**언제**: "..." 버튼의 액션 메뉴.

### Tooltip
**위치**: `@/components/ui/tooltip`  
**언제**: 아이콘 버튼 설명 등 간단한 텍스트 힌트.

### ScrollArea
**위치**: `@/components/ui/scroll-area`  
**언제**: 고정 높이 내에서 스크롤 가능한 영역.

---

## 6. 날짜/시간 입력

### DatePicker
**위치**: `@/components/ui/date-picker`  
**언제**: 날짜 선택. react-day-picker 기반.

### TimePicker
**위치**: `@/components/ui/time-picker`

### DayOfWeekPicker
**위치**: `@/components/ui/day-of-week-picker`  
**언제**: 반복 스케줄 요일 선택.

---

## 7. 폼 헬퍼

### FormField (react-hook-form 통합)
**위치**: `@/components/form/form-field`  
**언제**: react-hook-form을 사용하는 폼의 필드 래퍼. Label + 입력 요소 + 에러/도움말 텍스트 자동 처리.
```tsx
import { FormField } from '@/components/form/form-field'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'

const { control } = useForm()
<FormField control={control} name="segmentName" label="세그먼트명" required helperText="영문+숫자 조합 권장">
  {({ field, fieldId, hasError }) => (
    <Input id={fieldId} {...field} className={hasError ? 'border-error' : ''} />
  )}
</FormField>
```

### Label
**위치**: `@/components/ui/label`  
**언제**: 폼 필드 레이블. FormField를 쓸 수 없을 때 직접 사용.

---

## 8. 도메인 컴포넌트 (SEG 전용)

### FilterGroup
**위치**: `@/components/seg/filter-group`  
**언제**: 세그먼트 조건 그룹 (AND/OR 연산자 포함).

### FilterConditionRow
**위치**: `@/components/seg/filter-condition-row`  
**언제**: 개별 조건 행 (속성명, 연산자, 값 입력).

### FilterOperatorBadge
**위치**: `@/components/seg/filter-operator-badge`  
**언제**: AND/OR 연산자 배지.

### FilterModeIndicator
**위치**: `@/components/seg/filter-mode-indicator`  
**언제**: Batch/Live 모드 표시 인디케이터.

### SqlCodeBlock
**위치**: `@/components/seg/sql-code-block`  
**언제**: 생성된 SQL 쿼리 표시.

### AiPanel
**위치**: `@/components/seg/ai-panel`  
**언제**: AI 필터 추천 패널. primary(딥 바이올렛) 배경.

---

## 유틸리티

### cn
**위치**: `@/lib/cn`  
**항상 import**: 조건부 클래스 조합에 필수.
```tsx
import { cn } from '@/lib/cn'
<div className={cn("base-class", isActive && "active-class")} />
```

---

## 자주 쓰는 패턴

### 탑바 + 사이드바 레이아웃
```tsx
<div className="flex flex-col h-screen">
  <Topbar logo={...} actions={...} />
  <div className="flex flex-1 overflow-hidden">
    <Sidebar />
    <main className="flex-1 overflow-auto p-6 bg-neutral-100">
      {/* 콘텐츠 */}
    </main>
  </div>
</div>
```

### 탑바 + 중앙 콘텐츠 레이아웃
```tsx
<div className="min-h-screen flex flex-col bg-neutral-100">
  <Topbar logo={...} actions={...} />
  <main className="flex-1 max-w-[1200px] mx-auto w-full px-8 py-6">
    {/* 콘텐츠 */}
  </main>
</div>
```

### 멀티스텝 폼 레이아웃
```tsx
<div className="min-h-screen flex flex-col bg-neutral-100">
  <Topbar ... />
  <main className="flex-1 max-w-[800px] mx-auto w-full px-8 py-6">
    <StepIndicator steps={[...]} currentStep={1} className="mb-8" />
    <Card><CardContent>...</CardContent></Card>
  </main>
  <StickyActionBar>
    <Button variant="ghost">이전</Button>
    <Button variant="primary">다음</Button>
  </StickyActionBar>
</div>
```

### 목록 + 헤더 레이아웃
```tsx
<div className="min-h-screen flex flex-col bg-neutral-100">
  <Topbar ... />
  <main className="flex-1 p-6">
    <div className="flex items-center justify-between mb-4">
      <h1 className="text-xl font-semibold text-on-surface">세그먼트 목록</h1>
      <Button variant="primary">+ 세그먼트 생성</Button>
    </div>
    <Card>
      <CardContent className="p-0">
        <DataTable data={...} columns={...} keyExtractor={...} />
      </CardContent>
    </Card>
  </main>
</div>
```
