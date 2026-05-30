---
title: "Deployments & Rollouts"
cert: ckad
roadmap: application-design
subtopic: Deployments & Rollouts
difficulty: beginner
order: 1
tags: [deployments, rollouts, rollback, strategy]
---

# Deployments & Rollouts

A **Deployment** is the standard way to run stateless applications in Kubernetes. It manages a ReplicaSet under the hood and adds declarative update and rollback capabilities on top.

## Deployment Strategies

### RollingUpdate (default)
Gradually replaces old pods with new ones. Zero downtime.

```yaml
spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1        # extra pods allowed above desired count
      maxUnavailable: 0  # pods that can be unavailable during update
```

### Recreate
Kills **all** old pods first, then creates new ones. Causes brief downtime.

```yaml
spec:
  strategy:
    type: Recreate
```

## Key Commands

```bash
# Create a deployment
kubectl create deployment nginx --image=nginx:1.21

# Scale
kubectl scale deployment nginx --replicas=5

# Update image (triggers rollout)
kubectl set image deployment/nginx nginx=nginx:1.22

# Check rollout status
kubectl rollout status deployment/nginx

# View rollout history
kubectl rollout history deployment/nginx

# Rollback to previous revision
kubectl rollout undo deployment/nginx

# Rollback to a specific revision
kubectl rollout undo deployment/nginx --to-revision=2

# Pause / resume a rollout
kubectl rollout pause deployment/nginx
kubectl rollout resume deployment/nginx
```

## Rollout Revisions

Every `kubectl set image` or `kubectl apply` that changes the pod spec creates a **new revision**. Kubernetes keeps up to `revisionHistoryLimit` (default: 10) old ReplicaSets so you can roll back at any time.

```bash
kubectl rollout history deployment/nginx --revision=2
```

## CKAD Exam Tips

- Know the difference between `Recreate` and `RollingUpdate`
- Practice `kubectl rollout undo` and `--to-revision`
- Understand `maxSurge` and `maxUnavailable` tuning
- Use `--record` flag (deprecated but may appear in exams) or annotations to document changes
