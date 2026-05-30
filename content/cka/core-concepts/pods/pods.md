> **Source:** [KodeKloud CKA Course — 02-Core-Concepts](https://github.com/kodekloudhub/certified-kubernetes-administrator-course/tree/master/docs/02-Core-Concepts) | 📅 Created: May 2026

# Pods

## What is a Pod?

A **Pod** is the smallest deployable unit in Kubernetes. It represents:
- One or more tightly coupled containers
- Shared network namespace (same IP, same ports)
- Shared storage (volumes)
- A single scheduling unit

> Kubernetes does not deploy containers directly — it wraps them in pods.

## Single-Container Pod (Most Common)

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
  labels:
    app: nginx
spec:
  containers:
  - name: nginx
    image: nginx:1.25
    ports:
    - containerPort: 80
```

## Multi-Container Pod (Helper / Sidecar Pattern)

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: web-with-logger
spec:
  containers:
  - name: web
    image: nginx
  - name: log-agent
    image: log-agent
```

Containers in the same pod:
- Share `localhost` network
- Can share volumes
- Are always scheduled together on the same node

## Essential kubectl Commands for Pods

```bash
# Create a pod
kubectl run nginx --image=nginx

# Generate YAML (dry run)
kubectl run nginx --image=nginx --dry-run=client -o yaml

# List pods
kubectl get pods
kubectl get pods -o wide          # includes node and IP
kubectl get pods -n kube-system   # different namespace

# Describe a pod
kubectl describe pod nginx

# Get logs
kubectl logs nginx
kubectl logs nginx -c log-agent   # specific container

# Execute command inside pod
kubectl exec -it nginx -- /bin/bash

# Delete a pod
kubectl delete pod nginx
```