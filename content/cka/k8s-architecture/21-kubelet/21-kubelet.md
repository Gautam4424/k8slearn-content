---
title: "2.1 kubelet"
cert: ["cka"]
roadmap: "k8s-architecture"
subtopic: "2.1 kubelet"
difficulty: "intermediate"
order: 9
tags: ["cka", "k8s-architecture"]
---

# 2.1 kubelet
> The **node agent** — runs on every worker node and manages Pods on that node.

**What it does:**

- Watches API Server for Pods assigned to its node
- Calls the Container Runtime Interface (CRI) to start/stop containers
- Reports node and Pod status back to API Server
- Runs liveness, readiness, and startup probes
- Mounts volumes (calls CSI driver)
- Manages pod networking (calls CNI plugin)
```mermaid
flowchart TD
    API["API Server\nPod spec assigned"]
    KL["kubelet"]
    CRI["CRI - containerd/CRI-O\npull image · create · start/stop"]
    CNI["CNI Plugin\nsetup pod network · assign IP\nconfigure iptables/eBPF"]
    CSI["CSI Driver\nmount volumes"]
    API --> KL
    KL --> CRI & CNI & CSI
    style KL fill:#dbeafe,stroke:#3b82f6
```

---
