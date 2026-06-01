---
title: "Example 1 — Required: Large OR Medium Nodes"
cert: ["cka"]
roadmap: "scheduling"
subtopic: "Example 1 — Required: Large OR Medium Nodes"
difficulty: "intermediate"
order: 20
tags: ["cka", "scheduling"]
---

# Example 1 — Required: Large OR Medium Nodes
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: data-processor
spec:
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
        - matchExpressions:
          - key: size
            operator: In
            values:
            - Large
            - Medium     # OR logic within the values list
  containers:
  - name: processor
    image: data-processor:v2
```
