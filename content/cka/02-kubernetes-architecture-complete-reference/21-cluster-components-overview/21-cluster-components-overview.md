---
title: "2.1 Cluster Components Overview"
cert: ["cka"]
roadmap: "02-kubernetes-architecture-complete-reference"
subtopic: "2.1 Cluster Components Overview"
difficulty: "intermediate"
order: 1
tags: ["cka"]
---

# 2.1 Cluster Components Overview

> Part of **02 ☸️ Kubernetes Architecture** | CKA Chapter 2

A complete bird's-eye view of every component in a Kubernetes cluster and how they relate to each other.

---

# What is Kubernetes?

Kubernetes is a **container orchestration platform** — it automates deploying, scaling, and managing containerised applications. You tell it *what* you want (desired state), and it continuously works to make reality match that.

```mermaid
graph TD
    subgraph CP["☸️ Control Plane — The Brain"]
        API["kube-apiserver\nFront door of the cluster"]
        ETCD[("etcd\nAll cluster state")]
        SCHED["kube-scheduler\nDecides where pods run"]
        CTRL["controller-manager\nKeeps desired = actual"]
        CCM["cloud-controller-manager\nCloud provider integration"]
    end
    subgraph W1["🖥️ Worker Node 1"]
        KL1["kubelet"] --> CR1["containerd"] --> P1["Pods"]
        KP1["kube-proxy"]
    end
    subgraph W2["🖥️ Worker Node 2"]
        KL2["kubelet"] --> CR2["containerd"] --> P2["Pods"]
        KP2["kube-proxy"]
    end
    API <--> ETCD
    API --> SCHED & CTRL & CCM
    API --> KL1 & KL2
```

---

# Control Plane vs Worker Nodes


> ⚠️ **Notice:** Table content could not be synced from Notion due to integration permission restrictions.

## Control Plane Components


| Component | Role | Stateless? |
| --- | --- | --- |
| kube-apiserver | Front door — all communication goes through it | ✅ Yes — can scale horizontally |
| etcd | Key-value store — stores ALL cluster state | ❌ No — has persistent state |
| kube-scheduler | Picks which node a new pod runs on | ✅ Yes |
| kube-controller-manager | Runs reconciliation loops | ✅ Yes |
| cloud-controller-manager | Integrates with cloud provider APIs | ✅ Yes |

## Worker Node Components


| Component | Role |
| --- | --- |
| kubelet | Node agent — starts/stops containers, reports status |
| kube-proxy | Handles Service networking (iptables/IPVS rules) |
| Container Runtime | Actually runs containers (containerd, CRI-O) |

---

# The Golden Rule — Desired State

```mermaid
flowchart LR
    YOU["You declare\nI want 3 nginx pods"]
    API["API Server\nstores in etcd"]
    CTRL["Controller\nnotices 0 pods exist"]
    ACT["Creates 3 pods\non worker nodes"]
    WATCH["Continuously watches\nif one dies → creates another"]
    YOU --> API --> CTRL --> ACT --> WATCH --> CTRL
```

> 💡 You never say **how** to do things — you say **what** you want. Kubernetes figures out the how.

---

# Quick Command Reference

```bash
# See all nodes in your cluster
kubectl get nodes
kubectl get nodes -o wide          # with IPs and OS info

# See control plane pods
kubectl get pods -n kube-system

# Component health
kubectl get componentstatuses

# Cluster info
kubectl cluster-info
```

