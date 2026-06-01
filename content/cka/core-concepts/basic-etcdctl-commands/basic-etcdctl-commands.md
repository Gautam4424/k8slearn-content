---
title: "Basic etcdctl Commands"
cert: ["cka"]
roadmap: "core-concepts"
subtopic: "Basic etcdctl Commands"
difficulty: "intermediate"
order: 11
tags: ["cka", "core-concepts"]
---

# Basic etcdctl Commands
```bash
# Set a key
etcdctl put key1 value1

# Get a key
etcdctl get key1

# etcdctl API version (Kubernetes uses v3)
export ETCDCTL_API=3
etcdctl version
```

---

# 4. ETCD in Kubernetes
