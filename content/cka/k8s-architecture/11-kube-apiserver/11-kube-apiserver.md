---
title: "1.1 kube-apiserver"
cert: ["cka"]
roadmap: "k8s-architecture"
subtopic: "1.1 kube-apiserver"
difficulty: "intermediate"
order: 4
tags: ["cka", "k8s-architecture"]
---

# 1.1 kube-apiserver
> The **front door** of the Kubernetes cluster. All communication — internal or external — goes through the API Server.

**What it does:**

- Exposes the Kubernetes REST API
- Authenticates and authorizes all requests
- Validates and persists cluster state to etcd
- Acts as the central hub for all component communication
- Implements admission control (webhooks, OPA, etc.)
**Key characteristics:**

- Stateless — can be horizontally scaled
- Only component that directly reads/writes etcd
- Uses watch API so components get real-time updates (no polling)
```mermaid
flowchart TD
    CLI["kubectl / SDK"]
    AUTH["1. Authentication\ncerts · tokens · OIDC · webhook"]
    AUTHZ["2. Authorization\nRBAC · ABAC · webhook"]
    MUT["3. Mutating Admission\nadd sidecars · set defaults"]
    VAL["4. Validating Admission\nreject invalid configs"]
    ETCD[("Persist to etcd ✅")]
    CLI --> AUTH --> AUTHZ --> MUT --> VAL --> ETCD
    style MUT fill:#fef3c7,stroke:#f59e0b
    style VAL fill:#fee2e2,stroke:#ef4444
    style ETCD fill:#dbeafe,stroke:#3b82f6
```

---
