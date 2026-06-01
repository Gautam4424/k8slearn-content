---
title: "Create HPA Imperative"
cert: ["cka"]
roadmap: "workload-autoscaling"
subtopic: "Create HPA Imperative"
difficulty: "intermediate"
order: 2
tags: ["cka", "workload-autoscaling"]
---

# Create HPA Imperative
```bash
# Create HPA targeting 50% CPU
kubectl autoscale deployment myapp \
  --cpu-percent=50 \
  --min=2 \
  --max=10

# Check HPA status
kubectl get hpa
# NAME    REFERENCE          TARGETS   MINPODS   MAXPODS   REPLICAS
# myapp   Deployment/myapp   80%/50%   2         10        4

kubectl describe hpa myapp
```
