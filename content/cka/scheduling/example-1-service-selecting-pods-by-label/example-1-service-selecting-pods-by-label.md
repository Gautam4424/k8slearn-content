---
title: "Example 1 — Service Selecting Pods by Label"
cert: ["cka"]
roadmap: "scheduling"
subtopic: "Example 1 — Service Selecting Pods by Label"
difficulty: "intermediate"
order: 6
tags: ["cka", "scheduling"]
---

# Example 1 — Service Selecting Pods by Label
```yaml
# Service selects pods by label — NOT by pod name
apiVersion: v1
kind: Service
metadata:
  name: payment-svc
spec:
  selector:
    app: payment-service
    env: production        # only routes to pods with BOTH labels
  ports:
  - port: 80
    targetPort: 8080
```

```yaml
# Pod must have matching labels to receive traffic
apiVersion: v1
kind: Pod
metadata:
  name: payment-pod-1
  labels:
    app: payment-service
    env: production        # matches → gets traffic
    version: v2.1
spec:
  containers:
  - name: payment
    image: payment:v2.1
```
