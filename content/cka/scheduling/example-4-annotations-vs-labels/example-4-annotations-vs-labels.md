---
title: "Example 4 — Annotations vs Labels"
cert: ["cka"]
roadmap: "scheduling"
subtopic: "Example 4 — Annotations vs Labels"
difficulty: "intermediate"
order: 9
tags: ["cka", "scheduling"]
---

# Example 4 — Annotations vs Labels
```yaml
metadata:
  labels:
    app: payment-service    # queryable — used for selection
    env: production
  annotations:
    git-commit: "a3f8d2c"          # not queryable, just metadata
    build-number: "2024-build-47"
    team-contact: "platform@company.com"
    docs: "https://wiki.company.com/payment"
```
