---
title: "2.3 Container Runtime"
cert: ["cka"]
roadmap: "k8s-architecture"
subtopic: "2.3 Container Runtime"
difficulty: "intermediate"
order: 11
tags: ["cka", "k8s-architecture"]
---

# 2.3 Container Runtime
> The software that **actually runs containers** on the node.

**Interface: CRI (Container Runtime Interface)** — a gRPC API that kubelet uses.

**Common runtimes:**

- `containerd` — default in most distributions (kubeadm, GKE, EKS, AKS)
- `CRI-O` — lightweight, RHEL/OpenShift focused
- `Docker Engine` (via cri-dockerd shim) — legacy
---

# 3. Kubernetes Objects & Abstractions
