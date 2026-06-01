---
title: "1.2 etcd"
cert: ["cka"]
roadmap: "k8s-architecture"
subtopic: "1.2 etcd"
difficulty: "intermediate"
order: 5
tags: ["cka", "k8s-architecture"]
---

# 1.2 etcd
> The **single source of truth** — a distributed key-value store that holds ALL cluster state.

**What it does:**

- Stores all Kubernetes objects: Pods, Services, ConfigMaps, Secrets, etc.
- Uses the Raft consensus algorithm for high availability
- Provides watch semantics — components react to changes in real-time
**Key characteristics:**

- Strongly consistent reads and writes
- Only kube-apiserver talks directly to etcd
- In production: run as a 3 or 5 node cluster for quorum
- Data stored under `/registry/` namespace prefix
```mermaid
flowchart LR
    E1[("etcd #1\nleader")] <-->|Raft| E2[("etcd #2")]
    E2 <-->|Raft| E3[("etcd #3")]
    E1 <-->|Raft| E3
    API["kube-apiserver\nOnly read/write path"] --> E1
    style E1 fill:#fef3c7,stroke:#f59e0b
```

---
