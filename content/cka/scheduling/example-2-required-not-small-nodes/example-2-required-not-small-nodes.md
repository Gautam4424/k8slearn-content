---
title: "Example 2 — Required: NOT Small Nodes"
cert: ["cka"]
roadmap: "scheduling"
subtopic: "Example 2 — Required: NOT Small Nodes"
difficulty: "intermediate"
order: 21
tags: ["cka", "scheduling"]
---

# Example 2 — Required: NOT Small Nodes
```yaml
spec:
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
        - matchExpressions:
          - key: size
            operator: NotIn
            values:
            - Small
```
