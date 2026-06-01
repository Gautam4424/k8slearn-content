---
title: "3.3 Deployments"
cert: ["cka"]
roadmap: "03-core-concepts-pods-services-deployments"
subtopic: "3.3 Deployments"
difficulty: "intermediate"
order: 3
tags: ["cka"]
---

# 3.3 Deployments

> Part of **03 🧠 Core Concepts** | CKA Chapter 3

Deployments are the **primary way to run stateless applications** in Kubernetes. They add rolling updates and rollbacks on top of ReplicaSets.

---

# Deployment → ReplicaSet → Pod

```mermaid
graph TD
    D["Deployment\ndeclares desired state"]
    RS1["ReplicaSet v1\n(old — scaled to 0)"]
    RS2["ReplicaSet v2\n(current — replicas=3)"]
    P1["Pod"] & P2["Pod"] & P3["Pod"]
    D --> RS1 & RS2
    RS2 --> P1 & P2 & P3
    style D fill:#dbeafe,stroke:#3b82f6
    style RS1 fill:#f3f4f6,stroke:#9ca3af
    style RS2 fill:#d1fae5,stroke:#10b981
```

---

# Create a Deployment

```bash
# Imperative
kubectl create deployment web --image=nginx:1.25 --replicas=3

# Generate YAML
kubectl create deployment web --image=nginx:1.25 --replicas=3 \
  --dry-run=client -o yaml > deployment.yaml
```

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1          # max extra pods during update
      maxUnavailable: 0    # max pods down during update
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
      - name: nginx
        image: nginx:1.25
        ports:
        - containerPort: 80
        resources:
          requests:
            cpu: 100m
            memory: 128Mi
          limits:
            cpu: 500m
            memory: 256Mi
```

---

# Rolling Update Flow

```mermaid
sequenceDiagram
    participant User
    participant API
    participant RS1 as ReplicaSet v1
    participant RS2 as ReplicaSet v2
    User->>API: kubectl set image deploy/web nginx=nginx:1.26
    API->>RS2: create new ReplicaSet
    loop Rolling (maxSurge=1, maxUnavailable=0)
        RS2->>API: create new pod v2
        Note over API: health check passes ✅
        RS1->>API: terminate old pod v1
    end
    Note over RS1: scaled to 0 — kept for rollback
    API-->>User: rollout complete ✅
```

---

# Key Commands

```bash
# Create + manage
kubectl create deployment web --image=nginx:1.25 --replicas=3
kubectl get deployments
kubectl describe deployment web

# Scale
kubectl scale deployment web --replicas=5

# Update image
kubectl set image deployment/web nginx=nginx:1.26

# Rollout
kubectl rollout status deployment/web
kubectl rollout history deployment/web
kubectl rollout undo deployment/web
kubectl rollout undo deployment/web --to-revision=1

# Pause/resume (batch multiple changes)
kubectl rollout pause deployment/web
kubectl rollout resume deployment/web

# Delete
kubectl delete deployment web
```

