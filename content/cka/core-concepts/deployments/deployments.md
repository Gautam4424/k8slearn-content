> **Source:** [KodeKloud CKA Course — 02-Core-Concepts](https://github.com/kodekloudhub/certified-kubernetes-administrator-course/tree/master/docs/02-Core-Concepts) | 📅 Created: May 2026

# Deployments

## What is a Deployment?

A **Deployment** wraps a ReplicaSet and adds:
- **Rolling updates** — update containers with zero downtime
- **Rollbacks** — revert to a previous version
- **Pause & Resume** — batch multiple changes before rolling out

> Deployment → creates ReplicaSet → creates Pods

## Deployment YAML

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp-deployment
  labels:
    app: myapp
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
      - name: nginx
        image: nginx:1.25
        ports:
        - containerPort: 80
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 1
```

## Update Strategies

| Strategy | Behavior |
| --- | --- |
| `RollingUpdate` | Gradually replaces old pods with new ones (default) |
| `Recreate` | Kills all old pods first, then creates new ones (causes downtime) |

## Key Commands

```bash
# Create
kubectl create deployment myapp --image=nginx --replicas=3

# Update image
kubectl set image deployment/myapp nginx=nginx:1.26

# Check rollout status
kubectl rollout status deployment/myapp

# View rollout history
kubectl rollout history deployment/myapp

# Rollback
kubectl rollout undo deployment/myapp
kubectl rollout undo deployment/myapp --to-revision=2

# Scale
kubectl scale deployment myapp --replicas=5

# Pause / resume
kubectl rollout pause deployment/myapp
kubectl rollout resume deployment/myapp
```