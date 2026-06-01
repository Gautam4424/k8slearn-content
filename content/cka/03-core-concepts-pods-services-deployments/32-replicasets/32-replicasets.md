---
title: "3.2 ReplicaSets"
---
# 3.2 ReplicaSets

> Part of **03 🧠 Core Concepts** | CKA Chapter 3

ReplicaSets ensure a **specified number of pod replicas** are always running at any time.

---

# What is a ReplicaSet?

```mermaid
flowchart TD
    RS["ReplicaSet\nreplicas: 3"]
    P1["Pod 1 ✅"]
    P2["Pod 2 ✅"]
    P3["Pod 3 ✅"]
    RS --> P1 & P2 & P3
    CTRL["ReplicaSet Controller\nwatches pod count continuously"]
    FAIL(["Pod 2 crashes ❌"])
    NEW["Creates new Pod 2 ✅"]
    CTRL -->|detects| FAIL --> NEW
    style RS fill:#dbeafe,stroke:#3b82f6
    style CTRL fill:#fef3c7,stroke:#f59e0b
```

> **In practice:** You almost never create ReplicaSets directly. You use **Deployments** instead — they manage ReplicaSets for you and add rolling updates + rollback.

---

# ReplicaSet YAML

```yaml
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: web-rs
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web          # select pods with this label
  template:
    metadata:
      labels:
        app: web        # pods MUST have this label
    spec:
      containers:
      - name: nginx
        image: nginx:1.25
```

---

# Key Commands

```bash
kubectl get replicasets
kubectl get rs
kubectl describe rs web-rs

# Scale
kubectl scale rs web-rs --replicas=5

# Delete RS (does NOT delete pods unless --cascade=foreground)
kubectl delete rs web-rs
```

---

# How Selector Works

```mermaid
flowchart LR
    RS["ReplicaSet\nselector: app=web"]
    P1["Pod\napp=web ✅"]
    P2["Pod\napp=web ✅"]
    P3["Pod\napp=api ❌\nnot selected"]
    RS -->|manages| P1 & P2
    RS -->|ignores| P3
    style P3 fill:#fee2e2,stroke:#ef4444
```

> ⚠️ **Warning:** If you manually create pods with the same label as a ReplicaSet's selector, the RS will count them and may delete some to maintain the desired count.

