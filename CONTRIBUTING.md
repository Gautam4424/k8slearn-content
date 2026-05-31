# Contributing to k8slearn-content

Adding a new topic requires exactly **two files** placed in the correct folder.
No app code knowledge needed — just write markdown and fill in a JSON template.

## Folder structure

```
content/
  {cert}/
    {roadmap}/
      {subtopic}/
        {subtopic}.md
        {subtopic}.json
```

**Example** — adding "Taints and tolerations" to CKA:

```
content/cka/scheduling/taints/taints.md
content/cka/scheduling/taints/taints.json
```

## The JSON file

Copy this template. Every field marked required must be present.

```json
{
  "title": "Your topic title",
  "cert": "cka",
  "roadmap": "Scheduling",
  "subtopic": "Taints",
  "difficulty": "beginner",
  "content": "your-filename.md",
  "order": 1,
  "tags": ["tag1", "tag2"],
  "questions": [
    {
      "type": "mcq",
      "q": "Your question here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": 0,
      "explanation": "Why the correct answer is correct."
    }
  ]
}
```

**Field rules:**

| Field | Required | Allowed values |
|---|---|---|
| `cert` | yes | `cka` `ckad` `cks` `kcna` |
| `difficulty` | yes | `beginner` `intermediate` `advanced` |
| `content` | yes | filename of your `.md` file in the same folder |
| `type` (per question) | yes | `mcq` `multi-select` `true-false` |
| `answer` | yes | zero-based index into `options` array |

## The MD file

Write plain markdown. No special syntax required.

```markdown
# Topic title

Your content here. Use standard markdown — headings, code blocks, tables, lists.

## Section heading

```yaml
apiVersion: v1
kind: Pod
```

## Another section

| Column 1 | Column 2 |
|---|---|
| Row 1    | Value    |
```

## Submitting

1. Fork this repo
2. Create a branch: `add/cka-scheduling-taints`
3. Add your two files
4. Open a PR — CI will validate your JSON automatically
5. If CI fails, read the error message, fix the issue, push again

## Adding a new certification

To add a cert not in the allowed list (e.g. a new CNCF exam), open an issue first.
A maintainer will add it to `schema.json` and the validator.

---

## How sidebar section (roadmap) ordering works

The sidebar lists sections in a deliberate order — not alphabetically. This is controlled
by the `roadmapOrder` array inside each cert's `exam.json`.

### The mechanism (end-to-end)

```
content/{cert}/exam.json          ← source of truth for ordering
        │
        │  roadmapOrder: ["core-concepts", "Scheduling", "Logging & Monitoring"]
        ▼
k8slearn-app  →  src/app/api/content/route.ts
        │
        │  Reads roadmapOrder, re-builds the tree object with
        │  roadmap keys in that sequence (case-insensitive match).
        │  Any unlisted roadmap falls to the end, alphabetically.
        ▼
k8slearn-app  →  src/components/Sidebar.tsx
        │
        │  Renders Object.entries(tree[cert]) in insertion order.
        │  Displays kebab-case keys as human-readable labels via
        │  the ROADMAP_LABELS lookup map (e.g. "core-concepts" → "Core Concepts").
        ▼
Browser sidebar — sections appear in roadmapOrder sequence
```

### The `roadmapOrder` array in `exam.json`

```json
{
  "roadmapOrder": [
    "core-concepts",
    "Scheduling",
    "Logging & Monitoring"
  ]
}
```

**Critical rule — the strings must exactly match the `roadmap` field in your topic JSON files.**

| Topic JSON `roadmap` value | Use this string in `roadmapOrder` |
|---|---|
| `"core-concepts"` | `"core-concepts"` |
| `"Scheduling"` | `"Scheduling"` |
| `"Logging & Monitoring"` | `"Logging & Monitoring"` |

The API normalises both sides with `.toLowerCase().trim()` before comparing, so
capitalisation differences are tolerated — but spelling must match exactly.

### Adding a new section at a specific position

**Step 1 — Pick a consistent roadmap name** and use it in all your topic JSON files:

```json
{
  "roadmap": "Storage",
  ...
}
```

**Step 2 — Insert it at the desired position** in `content/{cert}/exam.json`:

```json
{
  "roadmapOrder": [
    "core-concepts",
    "Scheduling",
    "Storage",              ← new section inserted here
    "Logging & Monitoring"
  ]
}
```

**Step 3 — Commit both** the topic files and the updated `exam.json` in the same PR.

### Human-readable sidebar labels

The Sidebar component maps internal roadmap keys to display labels via a lookup table
in `src/components/Sidebar.tsx`. Kebab-case keys (e.g. `"core-concepts"`) are
automatically displayed as `"Core Concepts"`.

If your new roadmap key needs a custom label (e.g. `"k8s-arch"` → `"K8s Architecture"`),
add it to the `ROADMAP_LABELS` map in `Sidebar.tsx`:

```ts
const ROADMAP_LABELS: Record<string, string> = {
  'core-concepts':    'Core Concepts',
  'k8s-architecture': 'K8s Architecture',
  // Add your entry here ↓
  'your-roadmap-key': 'Your Display Label',
}
```

### Troubleshooting: section appears at the wrong position

1. **Check the actual roadmap key** your topic uses — run:
   ```bash
   node -e "console.log(require('./content/cka/your-topic/your-topic.json').roadmap)"
   ```
2. **Confirm it matches** the string in `roadmapOrder` (case-insensitive, but spelling matters).
3. **Hard-refresh** the browser after pushing — the API response is not cached in development.

### Current CKA section order

| Position | roadmap key | Sidebar label |
|---|---|---|
| 1 | `core-concepts` | Core Concepts |
| 2 | `Scheduling` | Scheduling |
| 3 | `Logging & Monitoring` | Logging & Monitoring |
| 4+ | *(unlisted — alphabetical)* | *(raw key or ROADMAP_LABELS value)* |
