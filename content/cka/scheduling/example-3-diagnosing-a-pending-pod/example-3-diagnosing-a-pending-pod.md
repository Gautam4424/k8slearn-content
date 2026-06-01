---
title: "Example 3 — Diagnosing a Pending Pod"
cert: ["cka"]
roadmap: "scheduling"
subtopic: "Example 3 — Diagnosing a Pending Pod"
difficulty: "intermediate"
order: 5
tags: ["cka", "scheduling"]
---

# Example 3 — Diagnosing a Pending Pod
```bash
# Find why a pod is stuck in Pending
kubectl describe pod nginx-pending
# Events:
#   Warning  FailedScheduling  30s  default-scheduler
#            0/3 nodes available: 3 Insufficient memory.

# If Events section is empty — scheduler is likely down
kubectl get pods -n kube-system | grep scheduler

# Force recreate to change nodeName on an existing pod
kubectl replace --force -f pod.yaml
```

---

# 2. Labels and Selectors
