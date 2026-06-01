# Contributing to k8slearn-content

Welcome! Thank you for considering contributing to the Kubernetes learning platform. This repository is open-source and contains all the educational content, roadmap structures, and quiz questions.

Whether you want to fix a typo, add a new topic, or introduce an entirely new certification track, this guide will walk you through the process.

---

## 🌟 How to Contribute

1. **Fork the repository** on GitHub.
2. **Clone your fork** locally: `git clone https://github.com/YOUR_USERNAME/k8slearn-content.git`
3. **Create a branch** for your feature: `git checkout -b feature/add-new-topic`
4. **Make your changes** following the guidelines below.
5. **Validate** your changes locally: `node scripts/validate.js`
6. **Commit and push** your branch to your fork.
7. **Open a Pull Request** against the `main` branch of this repository.

---

## 🏗️ 1. Adding a New Certification

To introduce a completely new certification track (e.g., `cks`, `kcna`):

1. Create a new directory for the certification: `content/<cert-slug>/` (e.g., `content/cks/`).
2. Inside that directory, create an `exam.json` file. This file controls the exam metadata and the order of the learning roadmaps in the UI.

**Template for `exam.json`:**
```json
{
  "title": "Certified Kubernetes Security Specialist",
  "subtitle": "Brief description of the certification.",
  "duration": "2 Hours",
  "passingScore": "67%",
  "format": "Performance-based",
  "price": "$445 USD",
  "attempts": "2 attempts included",
  "roadmapOrder": [
    "cluster-setup",
    "cluster-hardening"
  ],
  "curriculum": [
    { "domain": "Cluster Setup", "weight": 10 },
    { "domain": "Cluster Hardening", "weight": 15 }
  ]
}
```

---

## 📚 2. Adding New Topics (Roadmaps) & Subtopics

Each topic (or roadmap) consists of multiple subtopics. A subtopic requires exactly two files: a Markdown file for content and a JSON file for metadata/quizzes.

### Folder Structure
- For a topic specific to **one certification**, create it under:  
  `content/<cert-slug>/<roadmap-slug>/<subtopic-slug>/`
- For **common topics** shared across multiple certifications, create it under:  
  `content/common/<roadmap-slug>/<subtopic-slug>/`

### The Markdown File (`.md`)
Start with YAML frontmatter, followed by standard GitHub markdown. Use `mermaid` blocks for diagrams instead of ASCII art.

```markdown
---
title: "Topic Title"
cert: ["cka", "ckad"]
roadmap: your-roadmap-slug
subtopic: Subtopic Name
difficulty: intermediate
order: 1
tags: [tag1, tag2]
---

# Topic Title
Your content goes here...
```

### The JSON Metadata File (`.json`)
This defines the structure and the multiple-choice questions (MCQs). 
- Note that the `answer` field is a **0-based index** into the options array.
- For multi-cert topics, notice how `cert` is an array and `order` maps to each certification explicitly.

```json
{
  "title": "Topic Title",
  "cert": ["cka", "ckad"],
  "roadmap": "your-roadmap-slug",
  "subtopic": "Subtopic Name",
  "difficulty": "intermediate",
  "content": "your-subtopic-slug.md",
  "order": {
    "cka": 1,
    "ckad": 3
  },
  "tags": ["tag1", "tag2"],
  "questions": [
    {
      "type": "mcq",
      "q": "Your question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": 1,
      "explanation": "Option B is correct because..."
    }
  ]
}
```

---

## 🔗 3. Updating the Exam Roadmap
If you created a **new roadmap** (a new topic category), you must add its `roadmap-slug` to the `roadmapOrder` array inside the `exam.json` of every certification it belongs to (e.g., `content/cka/exam.json`).

```json
  "roadmapOrder": [
    "core-concepts",
    "your-roadmap-slug"
  ],
```
*If you are only adding a subtopic to an existing roadmap, you skip this step.*

---

## ✅ 4. Local Validation
Always run the validation script before committing and opening a Pull Request. It automatically checks for missing fields, valid metadata, and correct question formats.

```bash
node scripts/validate.js
```
