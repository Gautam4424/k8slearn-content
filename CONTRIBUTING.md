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
