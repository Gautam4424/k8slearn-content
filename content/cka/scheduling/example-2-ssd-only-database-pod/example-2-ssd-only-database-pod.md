---
title: "Example 2 — SSD-Only Database Pod"
cert: ["cka"]
roadmap: "scheduling"
subtopic: "Example 2 — SSD-Only Database Pod"
difficulty: "intermediate"
order: 18
tags: ["cka", "scheduling"]
---

# Example 2 — SSD-Only Database Pod
```bash
kubectl label nodes node-ssd-01 disk=ssd
kubectl label nodes node-ssd-02 disk=ssd
```

```yaml
spec:
  nodeSelector:
    disk: ssd
  containers:
  - name: db
    image: postgres:15
```

> **Limitation:** `nodeSelector` only supports exact equality. No OR, NOT, or complex expressions → use Node Affinity for those.

---

# 5. Node Affinity

More expressive replacement for `nodeSelector` — supports complex expressions.
