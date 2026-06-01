---
title: "Example 3 — Preferred with Weights (Best-Effort)"
cert: ["cka"]
roadmap: "scheduling"
subtopic: "Example 3 — Preferred with Weights (Best-Effort)"
difficulty: "intermediate"
order: 22
tags: ["cka", "scheduling"]
---

# Example 3 — Preferred with Weights (Best-Effort)
```yaml
spec:
  affinity:
    nodeAffinity:
      preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 80          # strongly prefer SSD
        preference:
          matchExpressions:
          - key: disk
            operator: In
            values: [ssd]
      - weight: 20          # weakly prefer us-east-1a
        preference:
          matchExpressions:
          - key: topology.kubernetes.io/zone
            operator: In
            values: [us-east-1a]
```
