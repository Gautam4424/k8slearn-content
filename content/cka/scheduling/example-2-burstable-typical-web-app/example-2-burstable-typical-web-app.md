---
title: "Example 2 — Burstable (Typical Web App)"
cert: ["cka"]
roadmap: "scheduling"
subtopic: "Example 2 — Burstable (Typical Web App)"
difficulty: "intermediate"
order: 29
tags: ["cka", "scheduling"]
---

# Example 2 — Burstable (Typical Web App)
```yaml
spec:
  containers:
  - name: web
    image: nginx:1.25
    resources:
      requests:
        memory: "64Mi"
        cpu: "100m"
      limits:
        memory: "256Mi"    # can burst to 4x the request
        cpu: "500m"
```
