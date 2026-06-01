---
title: "Example 1 — High-Memory Workload on Specific Node"
cert: ["cka"]
roadmap: "scheduling"
subtopic: "Example 1 — High-Memory Workload on Specific Node"
difficulty: "intermediate"
order: 17
tags: ["cka", "scheduling"]
---

# Example 1 — High-Memory Workload on Specific Node
```bash
# Label the beefy node
kubectl label nodes node-highmem-01 size=large
```

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: memory-intensive-app
spec:
  nodeSelector:
    size: large
  containers:
  - name: app
    image: bigdata-processor:v3
    resources:
      requests:
        memory: "16Gi"
```
