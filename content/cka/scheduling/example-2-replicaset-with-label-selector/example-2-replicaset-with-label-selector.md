---
title: "Example 2 — ReplicaSet with Label Selector"
cert: ["cka"]
roadmap: "scheduling"
subtopic: "Example 2 — ReplicaSet with Label Selector"
difficulty: "intermediate"
order: 7
tags: ["cka", "scheduling"]
---

# Example 2 — ReplicaSet with Label Selector
```yaml
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: payment-rs
spec:
  replicas: 3
  selector:
    matchLabels:
      app: payment-service   # RS owns pods with this label
  template:
    metadata:
      labels:
        app: payment-service  # pods created by RS get this label
    spec:
      containers:
      - name: payment
        image: payment:v2.1
```
