---
title: "Example 4 — LimitRange with Min/Max Bounds"
cert: ["cka"]
roadmap: "scheduling"
subtopic: "Example 4 — LimitRange with Min/Max Bounds"
difficulty: "intermediate"
order: 32
tags: ["cka", "scheduling"]
---

# Example 4 — LimitRange with Min/Max Bounds
```yaml
apiVersion: v1
kind: LimitRange
metadata:
  name: default-limits
  namespace: dev
spec:
  limits:
  - type: Container
    default:           # applied as limit if container doesn't set one
      cpu: "500m"
      memory: "256Mi"
    defaultRequest:    # applied as request if not set
      cpu: "100m"
      memory: "128Mi"
    max:               # hard cap — exceeding this rejects the pod
      cpu: "2"
      memory: "1Gi"
    min:               # floor — going below this rejects the pod
      cpu: "50m"
      memory: "64Mi"
```
