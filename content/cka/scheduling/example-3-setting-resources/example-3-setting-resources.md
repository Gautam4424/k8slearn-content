---
title: "Example 3 — Setting Resources"
cert: ["cka"]
roadmap: "scheduling"
subtopic: "Example 3 — Setting Resources"
difficulty: "intermediate"
order: 30
tags: ["cka", "scheduling"]
---

# Example 3 — Setting Resources
```yaml
spec:
  containers:
  - name: nginx
    image: nginx
    resources:
      requests:
        memory: "64Mi"
        cpu: "250m"
      limits:
        memory: "128Mi"
        cpu: "500m"
```
