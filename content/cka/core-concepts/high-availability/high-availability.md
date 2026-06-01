---
title: "High Availability"
cert: ["cka"]
roadmap: "core-concepts"
subtopic: "High Availability"
difficulty: "intermediate"
order: 14
tags: ["cka", "core-concepts"]
---

# High Availability
In HA setups, **multiple etcd instances** run across master nodes. They must know about each other via `--initial-cluster` flag.

```bash
# Example etcd HA startup flag
--initial-cluster controller-0=https://10.0.0.10:2380,controller-1=https://10.0.0.11:2380
```

---

# 5. kube-apiserver
