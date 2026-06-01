---
title: "Example 1 — Guaranteed QoS (Production)"
cert: ["cka"]
roadmap: "scheduling"
subtopic: "Example 1 — Guaranteed QoS (Production)"
difficulty: "intermediate"
order: 28
tags: ["cka", "scheduling"]
---

# Example 1 — Guaranteed QoS (Production)
```yaml
spec:
  containers:
  - name: api
    image: payment-api:v3
    resources:
      requests:
        memory: "512Mi"
        cpu: "500m"
      limits:
        memory: "512Mi"    # identical to request = Guaranteed QoS
        cpu: "500m"
```
