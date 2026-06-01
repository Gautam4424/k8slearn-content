---
title: "2.2 kube-proxy"
cert: ["cka"]
roadmap: "k8s-architecture"
subtopic: "2.2 kube-proxy"
difficulty: "intermediate"
order: 10
tags: ["cka", "k8s-architecture"]
---

# 2.2 kube-proxy
> Implements **Service networking** on each node — handles load balancing from Service ClusterIP/NodePort to actual Pod IPs.

**Modes:**

[Table Placeholder]

**What it does:**

- Watches Service and Endpoints objects
- Programs node-level rules so traffic to a ClusterIP gets routed to a healthy Pod IP
---
