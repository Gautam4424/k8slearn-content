---
title: "Example 4 — Exists (GPU label, any value)"
cert: ["cka"]
roadmap: "scheduling"
subtopic: "Example 4 — Exists (GPU label, any value)"
difficulty: "intermediate"
order: 23
tags: ["cka", "scheduling"]
---

# Example 4 — Exists (GPU label, any value)
```yaml
# Schedule only on nodes that have a GPU label (regardless of value)
spec:
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
        - matchExpressions:
          - key: nvidia.com/gpu
            operator: Exists
```

[Table Placeholder]
