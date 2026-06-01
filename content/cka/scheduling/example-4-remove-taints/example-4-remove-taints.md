---
title: "Example 4 — Remove Taints"
cert: ["cka"]
roadmap: "scheduling"
subtopic: "Example 4 — Remove Taints"
difficulty: "intermediate"
order: 16
tags: ["cka", "scheduling"]
---

# Example 4 — Remove Taints
```bash
# Trailing - removes the taint
kubectl taint nodes node01 env=prod:NoSchedule-

# Allow workloads on control-plane (single-node dev cluster)
kubectl taint nodes controlplane node-role.kubernetes.io/control-plane:NoSchedule-
```

---

# 4. Node Selectors
