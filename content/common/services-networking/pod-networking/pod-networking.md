---
title: "Pod Networking & CNI"
cert: ["cka", "ckad", "cks"]
roadmap: services-networking
subtopic: Pod Networking & CNI
difficulty: intermediate
order: 1
tags: [cni, pod-networking, calico, flannel, cilium, veth, ipam]
---

# Pod Networking & CNI

Kubernetes requires every pod to have a unique IP address and mandates that pods can communicate with each other directly — without Network Address Translation (NAT). This is achieved through **CNI (Container Network Interface)** plugins.

---

## 🌐 Kubernetes Networking Requirements

Three fundamental rules govern all Kubernetes networking:

1. **Every pod must have a unique IP** — no two pods can share an IP across the cluster
2. **All pods can communicate with all other pods without NAT** — direct pod-to-pod connectivity
3. **All nodes can communicate with all pods without NAT** — bidirectional node-pod reachability

---

## 🏗️ Networking Layers Overview

```mermaid
flowchart TD
    subgraph L1["🖥️ Layer 1: Node Network"]
        N1["Node 1\n192.168.1.10"] <-->|"physical / cloud routing"| N2["Node 2\n192.168.1.11"]
    end
    subgraph L2["🟢 Layer 2: Pod Network (CNI)"]
        P1["Pod A\n10.244.1.2"] <-->|"no NAT — direct"| P2["Pod B\n10.244.2.3"]
        CNI["Calico / Flannel / Cilium\nevery pod gets unique IP"]
    end
    subgraph L3["🔵 Layer 3: Service Network"]
        SVC["Service ClusterIP\n10.96.50.100"]
        KP["kube-proxy\niptables / IPVS rules"]
        DNS["CoreDNS\ndb-svc.default.svc.cluster.local"]
    end
    subgraph L4["🌍 Layer 4: External Traffic"]
        ING["Ingress Controller"]
        LB["LoadBalancer / NodePort"]
    end

    L1 --> L2 --> L3 --> L4
    SVC --> KP --> P1 & P2
    DNS -->|resolves| SVC

    style L1 fill:#1c1917,stroke:#78716c,color:#e7e5e4
    style L2 fill:#064e3b,stroke:#10b981,color:#d1fae5
    style L3 fill:#1e3a8a,stroke:#3b82f6,color:#dbeafe
    style L4 fill:#3b1f6e,stroke:#a855f7,color:#e9d5ff
```

---

## ⚙️ CNI Plugin Flow

When a pod is created, `kubelet` delegates all network setup to the configured CNI plugin:

```mermaid
sequenceDiagram
    participant K as kubelet
    participant CNI as CNI Plugin (Calico)
    participant NS as Network Namespace
    participant IPAM as IPAM Pool

    K->>CNI: pod created — setup networking
    CNI->>NS: create network namespace for pod
    CNI->>NS: create veth pair\npod:eth0 ↔ host:vethXXX
    CNI->>IPAM: allocate IP from pool
    IPAM-->>CNI: 10.244.1.15
    CNI->>NS: assign 10.244.1.15 to pod eth0
    CNI->>K: networking ready ✅
    Note over K: pod can now reach any other pod
```

| Step | What CNI Does |
| --- | --- |
| 1️⃣ | Pod created → kubelet calls CNI plugin |
| 2️⃣ | CNI creates a network namespace for the pod |
| 3️⃣ | Creates a virtual ethernet pair (`eth0` in pod ↔ `vethXXX` on host) |
| 4️⃣ | Assigns IP to pod from IPAM pool |
| 5️⃣ | Sets up routes so pod is reachable cluster-wide |

---

## 📦 Popular CNI Plugins

| Plugin | Highlights |
| --- | --- |
| **Calico** | BGP-based routing, NetworkPolicy support, high performance |
| **Flannel** | Simple overlay (VXLAN), easy setup, limited policy support |
| **Cilium** | eBPF-based, L7-aware policies, observability built-in |
| **Weave** | Mesh overlay, automatic encryption, simple to deploy |

---

## 🛠️ CLI Quick Reference

```bash
# Check CNI plugin installed on node
ls /etc/cni/net.d/
ls /opt/cni/bin/

# Inspect CNI config
cat /etc/cni/net.d/10-calico.conflist

# Node IPs
kubectl get nodes -o wide

# Network interfaces on node
ip addr show
ip route

# Pod IPs
kubectl get pods -o wide

# Inspect networking inside a pod
kubectl exec -it nginx -- ip addr show
kubectl exec -it nginx -- ip route
```
