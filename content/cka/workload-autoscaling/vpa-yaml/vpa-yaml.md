---
title: "VPA YAML"
cert: ["cka"]
roadmap: "workload-autoscaling"
subtopic: "VPA YAML"
difficulty: "intermediate"
order: 5
tags: ["cka", "workload-autoscaling"]
---

# VPA YAML
```yaml
apiVersion: autoscaling.k8s.io/v1
kind: VerticalPodAutoscaler
metadata:
  name: myapp-vpa
spec:
  targetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: myapp
  updatePolicy:
    updateMode: "Auto"          # Off | Initial | Recreate | Auto
  resourcePolicy:
    containerPolicies:
    - containerName: myapp
      minAllowed:
        cpu: 50m
        memory: 64Mi
      maxAllowed:
        cpu: 2
        memory: 2Gi
      controlledResources:
      - cpu
      - memory
```

```bash
# Check VPA recommendations
kubectl describe vpa myapp-vpa
# Recommendation:
#   Container Recommendations:
#     Container Name: myapp
#     Lower Bound:    cpu: 100m  memory: 128Mi
#     Target:         cpu: 250m  memory: 512Mi
#     Upper Bound:    cpu: 1     memory: 1Gi

kubectl get vpa myapp-vpa -o yaml | grep -A20 recommendation
```
