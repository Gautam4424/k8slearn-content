# Contributing to k8slearn-content

Adding new content requires just two files per subtopic (Markdown + JSON) and an update to the exam roadmap.

---

## 1. Folder Structure
Create your new topic in `content/common/{roadmap-slug}/{subtopic-slug}/`:
- `{subtopic-slug}.md`: The markdown content (with YAML frontmatter).
- `{subtopic-slug}.json`: Metadata and MCQ quiz questions.

---

## 2. Markdown Content (`.md`)
Start with YAML frontmatter, followed by standard GitHub markdown. 
*Note: Use `mermaid` blocks for diagrams — no ASCII art.*

```markdown
---
title: "Topic Title"
cert: ["cka"]
roadmap: your-roadmap-slug
subtopic: Subtopic Name
difficulty: intermediate
order: 1
tags: [tag1, tag2]
---

# Topic Title
Your content goes here...
```

---

## 3. JSON Metadata & Quiz (`.json`)
This file defines the metadata and multiple-choice questions for the subtopic. Note that `answer` is a **0-based index** into the `options` array.

```json
{
  "title": "Topic Title",
  "cert": ["cka"],
  "roadmap": "your-roadmap-slug",
  "subtopic": "Subtopic Name",
  "difficulty": "intermediate",
  "content": "your-subtopic-slug.md",
  "order": {
    "cka": 1
  },
  "tags": ["tag1", "tag2"],
  "questions": [
    {
      "type": "mcq",
      "q": "Your question text here?",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "answer": 1,
      "explanation": "Option 2 is correct because..."
    }
  ]
}
```

---

## 4. Update the Exam Roadmap
To make your new roadmap visible in the app, you must add its `roadmap-slug` to the `roadmapOrder` array in the corresponding exam configuration file (e.g., `content/cka/exam.json`).

```json
  "roadmapOrder": [
    "core-concepts",
    "your-roadmap-slug"
  ],
```

---

## 5. Validation and Submitting
Before committing your changes, always run the validation script locally to check for missing fields or broken references.

```bash
node scripts/validate.js
```

Once it passes, commit and push your changes!
