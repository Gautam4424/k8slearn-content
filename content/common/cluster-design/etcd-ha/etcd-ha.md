---
title: "etcd HA & Raft Consensus"
cert: ["cka"]
roadmap: cluster-design
subtopic: etcd HA & Raft Consensus
difficulty: advanced
order: 2
tags: [etcd, raft, ha, quorum, consensus, fault-tolerance, leader-election]
---

# etcd HA & Raft Consensus

**etcd** is the distributed key-value store that holds all Kubernetes cluster state. In a production cluster, etcd runs as a multi-node cluster using the **Raft consensus algorithm** to guarantee consistency and fault tolerance.

---

## 🔄 Raft Consensus in etcd

```mermaid
flowchart LR
    subgraph RAFT["Raft Consensus Cluster"]
        direction LR
        L[("🏆 etcd Leader\naccepts all writes")] -->|"replicate log"| F1[("Follower 1\nreads only")]
        L -->|"replicate log"| F2[("Follower 2\nreads only")]
    end

    CLIENT["kubectl / API server\nwrites cluster state"] -->|"write request"| L
    NOTE["✅ Write committed when\nMAJORITY (quorum) confirms\n\nQuorum = ⌊N/2⌋ + 1"]

    style L    fill:#451a03,stroke:#f59e0b,color:#fef3c7
    style F1   fill:#1c1917,stroke:#78716c,color:#e7e5e4
    style F2   fill:#1c1917,stroke:#78716c,color:#e7e5e4
    style RAFT fill:#0f172a,stroke:#334155,color:#94a3b8
```

**Key principle**: writes are only committed once a **majority (quorum)** of nodes acknowledge — this prevents split-brain and data divergence.

---

## 📊 Quorum & Fault Tolerance Table

| etcd Nodes | Quorum Needed | Can Lose | Recommendation |
| --- | --- | --- | --- |
| **1** | 1 | 0 | ❌ No fault tolerance — dev only |
| **3** | 2 | 1 | ✅ Minimum for production |
| **5** | 3 | 2 | ✅ Recommended for production |
| **7** | 4 | 3 | ⚠️ Overkill for most clusters |

> ⚠️ **Always use an odd number of etcd nodes.** Using 4 nodes gives the same fault tolerance as 3 (can lose only 1) but introduces more risk in split-brain scenarios with no benefit.

---

## 🏗️ Stacked vs External etcd Topology

```mermaid
flowchart LR
    subgraph STACKED["Stacked etcd (default kubeadm)"]
        direction TB
        SM1["Master 1\napiserver + etcd"]
        SM2["Master 2\napiserver + etcd"]
        SM3["Master 3\napiserver + etcd"]
    end

    subgraph EXTERNAL["External etcd"]
        direction TB
        subgraph CP["Control Plane Nodes"]
            CM1["Master 1\napiserver only"]
            CM2["Master 2\napiserver only"]
        end
        subgraph ETCD["Dedicated etcd Nodes"]
            E1[("etcd 1")]
            E2[("etcd 2")]
            E3[("etcd 3")]
        end
    end

    style STACKED fill:#064e3b,stroke:#10b981,color:#d1fae5
    style EXTERNAL fill:#1e3a8a,stroke:#3b82f6,color:#dbeafe
    style ETCD fill:#451a03,stroke:#f59e0b,color:#fef3c7
```

| Topology | Pros | Cons |
| --- | --- | --- |
| **Stacked etcd** | Fewer nodes, simpler to set up with kubeadm | etcd failure affects control plane; failure domains coupled |
| **External etcd** | Complete isolation between etcd and control plane | More nodes to manage, higher infrastructure cost |

---

## 🛠️ CLI Quick Reference

```bash
# Check etcd cluster health (run on a master node)
ETCDCTL_API=3 etcdctl \
  --endpoints=https://127.0.0.1:2379 \
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \
  --cert=/etc/kubernetes/pki/etcd/server.crt \
  --key=/etc/kubernetes/pki/etcd/server.key \
  endpoint health

# List all etcd members and identify the leader
ETCDCTL_API=3 etcdctl \
  --endpoints=https://127.0.0.1:2379 \
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \
  --cert=/etc/kubernetes/pki/etcd/server.crt \
  --key=/etc/kubernetes/pki/etcd/server.key \
  member list

# Take a snapshot backup of etcd
ETCDCTL_API=3 etcdctl snapshot save /opt/etcd-backup.db \
  --endpoints=https://127.0.0.1:2379 \
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \
  --cert=/etc/kubernetes/pki/etcd/server.crt \
  --key=/etc/kubernetes/pki/etcd/server.key

# Verify snapshot integrity
ETCDCTL_API=3 etcdctl snapshot status /opt/etcd-backup.db --write-out=table
```
