---
title: "Rolling Updates & Rollbacks"
cert: ["cka"]
roadmap: "application-lifecycle-management"
subtopic: "Rolling Updates & Rollbacks"
difficulty: "intermediate"
order: 1
tags: ["cka"]
---

# Rolling Updates & Rollbacks

> Part of **04 ⚙️ Application Lifecycle Management** | CKA Chapter 4

---

# Rolling Updates

A rolling update replaces old pods with new ones **gradually** — zero downtime by default.

```mermaid
sequenceDiagram
    participant User
    participant RS1 as ReplicaSet v1 (old)
    participant RS2 as ReplicaSet v2 (new)
    User->>RS2: kubectl set image deploy/web nginx=nginx:1.26
    loop maxSurge=1, maxUnavailable=0
        RS2->>RS2: create new pod v2 ✅
        RS1->>RS1: terminate old pod v1
    end
    Note over RS1: scaled to 0, kept for rollback
```

```bash
# Update image
kubectl set image deployment/web nginx=nginx:1.26

# Watch rollout live
kubectl rollout status deployment/web

# View history
kubectl rollout history deployment/web

# Rollback to previous version
kubectl rollout undo deployment/web

# Rollback to specific revision
kubectl rollout undo deployment/web --to-revision=1

# Annotate change for history
kubectl annotate deployment/web kubernetes.io/change-cause="upgrade to nginx 1.26"

# Pause + batch multiple changes
kubectl rollout pause deployment/web
kubectl set image deployment/web nginx=nginx:1.26
kubectl set resources deployment/web -c nginx --limits=cpu=500m
kubectl rollout resume deployment/web
```

```yaml
# Deployment update strategy in YAML
spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1        # max extra pods above desired
      maxUnavailable: 0  # max pods below desired
```

## Recreate Strategy

```yaml
spec:
  strategy:
    type: Recreate     # kill ALL old pods first, then create new
                       # causes downtime — use only when needed
```

