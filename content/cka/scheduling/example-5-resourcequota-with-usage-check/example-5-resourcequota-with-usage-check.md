---
title: "Example 5 — ResourceQuota with Usage Check"
cert: ["cka"]
roadmap: "scheduling"
subtopic: "Example 5 — ResourceQuota with Usage Check"
difficulty: "intermediate"
order: 33
tags: ["cka", "scheduling"]
---

# Example 5 — ResourceQuota with Usage Check
```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: production-quota
  namespace: production
spec:
  hard:
    pods: "50"
    requests.cpu: "20"
    requests.memory: 40Gi
    limits.cpu: "40"
    limits.memory: 80Gi
    count/deployments.apps: "20"
    persistentvolumeclaims: "30"
```

```bash
kubectl describe resourcequota production-quota -n production
# Resource           Used   Hard
# --------           ----   ----
# limits.cpu         8      40
# limits.memory      16Gi   80Gi
# pods               12     50
```

---

# 8. DaemonSets

Ensures **one pod per node** automatically. New nodes get the pod; removed nodes lose it.
