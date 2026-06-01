---
title: "1.4 kube-controller-manager"
cert: ["cka"]
roadmap: "k8s-architecture"
subtopic: "1.4 kube-controller-manager"
difficulty: "intermediate"
order: 7
tags: ["cka", "k8s-architecture"]
---

# 1.4 kube-controller-manager
> Runs all **control loops** that reconcile desired state with actual state. Each controller watches the API Server and drives the cluster toward the desired state.

**Key Controllers:**

[Table Placeholder]

**Reconciliation Loop Pattern:**

```mermaid
flowchart TD
    WATCH["Watch API Server\nfor resource changes"]
    DIFF["Compute diff\ndesired state vs actual state"]
    ACT["Take corrective action\ncreate / delete / update"]
    STATUS["Update status\nvia API Server"]
    WATCH --> DIFF --> ACT --> STATUS --> WATCH
    style DIFF fill:#fef3c7,stroke:#f59e0b
    style ACT fill:#d1fae5,stroke:#10b981
```

---
