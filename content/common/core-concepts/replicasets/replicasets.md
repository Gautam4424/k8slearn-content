# ReplicaSets

## Why ReplicaSets?

- Ensures a **specified number of pod replicas** are always running
- If a pod dies → ReplicaSet creates a new one
- Supports **load balancing** across multiple pod replicas
- Can manage pods **not created by it** (using label selectors)

## Old vs New API

| Object | API Version | Status |
| --- | --- | --- |
| `ReplicationController` | v1 | Legacy |
| `ReplicaSet` | apps/v1 | Current |

> Use **ReplicaSet** (or better, **Deployment**) — never `ReplicationController` in new work.

## ReplicaSet YAML

```yaml
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: myapp-rs
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp     # Must match pod template labels
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
      - name: nginx
        image: nginx:1.25
```

> ⚠️ The `selector.matchLabels` field is **mandatory** in ReplicaSet (unlike ReplicationController).

## Scaling a ReplicaSet

```bash
# Method 1: Edit YAML and apply
kubectl apply -f replicaset.yaml

# Method 2: Imperative scale command
kubectl scale rs myapp-rs --replicas=6

# Method 3: Edit live object
kubectl edit rs myapp-rs
```

## Key Commands

```bash
kubectl get rs
kubectl describe rs myapp-rs
kubectl delete rs myapp-rs         # also deletes all pods
kubectl replace -f replicaset.yaml
```