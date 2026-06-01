---
title: "Example 2 — NoExecute with tolerationSeconds"
cert: ["cka"]
roadmap: "scheduling"
subtopic: "Example 2 — NoExecute with tolerationSeconds"
difficulty: "intermediate"
order: 14
tags: ["cka", "scheduling"]
---

# Example 2 — NoExecute with tolerationSeconds
```yaml
# Pod tolerates a not-ready node for 1 hour before eviction
spec:
  tolerations:
  - key: "node.kubernetes.io/not-ready"
    operator: "Exists"
    effect: "NoExecute"
    tolerationSeconds: 3600
```
