---
title: "Strategic Merge Patch"
cert: ["cka"]
roadmap: "kustomize"
subtopic: "Strategic Merge Patch"
difficulty: "intermediate"
order: 2
tags: ["cka", "kustomize"]
---

# Strategic Merge Patch
```mermaid
flowchart LR
    BASE["Base Deployment\nreplicas: 1\nimage: myapp:latest"]
    PATCH["Strategic Merge Patch\nreplicas: 5\nimage: myapp:v2"]
    RESULT["Final YAML\nreplicas: 5\nimage: myapp:v2\n(other fields kept)"]
    BASE --> RESULT
    PATCH --> RESULT
    style PATCH fill:#fef3c7,stroke:#f59e0b
    style RESULT fill:#d1fae5,stroke:#10b981
```

```yaml
# overlays/prod/kustomization.yaml
patches:
- path: increase-replicas.yaml      # reference a patch file
  target:
    kind: Deployment
    name: myapp
```

```yaml
# overlays/prod/increase-replicas.yaml (strategic merge patch)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
spec:
  replicas: 5                        # only this field overridden
  template:
    spec:
      containers:
      - name: myapp
        resources:
          limits:
            memory: 512Mi            # add/override specific field
```
