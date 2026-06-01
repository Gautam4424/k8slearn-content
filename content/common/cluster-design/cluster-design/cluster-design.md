---
title: "Cluster Design"
cert: ["cka"]
roadmap: cluster-design
subtopic: Cluster Design
difficulty: intermediate
order: 1
tags: [cluster-design, ha, control-plane, node-sizing, minikube, kubeadm, eks, gke, aks, k3s]
---

# Designing a Kubernetes Cluster

The right cluster design depends on your purpose, scale, and operational requirements. Key decisions include: managed vs self-managed, cloud vs on-prem, single-master vs HA, and node sizing.

---

## 🔄 Cluster Design Decision Tree

```mermaid
flowchart TD
    Q{"What is the purpose?"}
    Q -->|"Learning / dev"| A["Minikube / Kind\nkubeadm single-node"]
    Q -->|"Dev team"| B["k3s or\nkubeadm 3-node"]
    Q -->|"Production — cloud"| C["EKS / GKE / AKS\nmanaged control plane"]
    Q -->|"Production — on-prem"| D["kubeadm HA\n3 masters + 3+ workers"]

    HA{"Need High\nAvailability?"}
    C --> HA
    D --> HA
    HA -->|Yes| E["3+ master nodes\netcd HA cluster\nLoad Balancer front-end"]
    HA -->|No| F["Single master OK\nfor dev / test"]

    style Q   fill:#3b1f6e,stroke:#a855f7,color:#e9d5ff
    style HA  fill:#3b1f6e,stroke:#a855f7,color:#e9d5ff
    style C   fill:#1e3a8a,stroke:#3b82f6,color:#dbeafe
    style D   fill:#064e3b,stroke:#10b981,color:#d1fae5
    style E   fill:#451a03,stroke:#f59e0b,color:#fef3c7
    style A   fill:#1c1917,stroke:#78716c,color:#e7e5e4
    style B   fill:#1c1917,stroke:#78716c,color:#e7e5e4
    style F   fill:#1c1917,stroke:#78716c,color:#e7e5e4
```

---

## 📐 Node Sizing Guidelines

| Role | Minimum | Recommended |
| --- | --- | --- |
| **Master (control plane)** | 2 CPU, 4 GB RAM | 4 CPU, 8 GB RAM |
| **Worker (general workloads)** | 2 CPU, 4 GB RAM | 4+ CPU, 16 GB RAM |
| **Worker (ML / GPU)** | 8 CPU, 32 GB RAM | Dedicated GPU nodes per workload |
| **etcd** | 2 CPU, 8 GB RAM | SSD-backed, low-latency network |

---

## 🏗️ HA Control Plane Architecture

In a High Availability setup, a **Load Balancer** sits in front of 3+ API servers. The controller-manager and scheduler use **leader election** (only one is active at a time), while all API servers serve requests actively.

```mermaid
flowchart TD
    LB["⚖️ Load Balancer\nHAProxy / NGINX / Cloud LB\nsingle entry point :6443"]

    subgraph M1["Master Node 1"]
        API1["kube-apiserver"]
        CTRL1["controller-manager\n(standby)"]
        ETCD1[("etcd leader")]
    end
    subgraph M2["Master Node 2"]
        API2["kube-apiserver"]
        CTRL2["controller-manager\n(active — leader elected)"]
        ETCD2[("etcd follower")]
    end
    subgraph M3["Master Node 3"]
        API3["kube-apiserver"]
        CTRL3["controller-manager\n(standby)"]
        ETCD3[("etcd follower")]
    end

    LB --> API1 & API2 & API3
    ETCD1 <-->|Raft consensus| ETCD2
    ETCD2 <-->|Raft consensus| ETCD3
    ETCD1 <-->|Raft consensus| ETCD3

    style LB    fill:#1e3a8a,stroke:#3b82f6,color:#dbeafe
    style ETCD1 fill:#451a03,stroke:#f59e0b,color:#fef3c7
    style ETCD2 fill:#1c1917,stroke:#78716c,color:#e7e5e4
    style ETCD3 fill:#1c1917,stroke:#78716c,color:#e7e5e4
```

| Component | Mode | Count |
| --- | --- | --- |
| **Load Balancer** | — | 1 (or HA pair) — single entry point for kubectl and kubelets |
| **kube-apiserver** | Active-active | 3 (one per master) — all serve requests simultaneously |
| **kube-controller-manager** | Active-passive | 3 — leader election, only one acts at a time |
| **kube-scheduler** | Active-passive | 3 — leader election, only one acts at a time |
| **etcd** | Raft cluster | 3 or 5 — quorum-based writes |

---

## 📊 Cluster Design Decision Matrix

| Requirement | Recommended Setup |
| --- | --- |
| Local learning / dev | Minikube, Kind, or kubeadm single-node |
| Small dev team | k3s or kubeadm 3-node |
| Production — cloud | EKS / GKE / AKS (managed control plane) |
| Production — on-prem | kubeadm HA (3 masters + 3+ workers + MAAS/bare-metal) |
| Air-gapped / regulated | kubeadm with private registry + offline packages |
