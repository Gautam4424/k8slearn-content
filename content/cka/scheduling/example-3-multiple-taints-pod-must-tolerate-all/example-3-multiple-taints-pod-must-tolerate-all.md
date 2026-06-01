---
title: "Example 3 — Multiple Taints (pod must tolerate ALL)"
cert: ["cka"]
roadmap: "scheduling"
subtopic: "Example 3 — Multiple Taints (pod must tolerate ALL)"
difficulty: "intermediate"
order: 15
tags: ["cka", "scheduling"]
---

# Example 3 — Multiple Taints (pod must tolerate ALL)
```bash
kubectl taint nodes node01 env=prod:NoSchedule
kubectl taint nodes node01 team=platform:NoSchedule
```

```yaml
spec:
  tolerations:
  - key: "env"
    operator: "Equal"
    value: "prod"
    effect: "NoSchedule"
  - key: "team"
    operator: "Equal"
    value: "platform"
    effect: "NoSchedule"
```
