---
title: "Overview"
cert: ["cka"]
roadmap: "14-kustomize-configuration-management"
subtopic: "Overview"
difficulty: "beginner"
order: 1
tags: ["cka"]
---

# Overview

> **Source:** KodeKloud CKA Course — Kustomize Section (2025 Updates) | 📅 June 2026

Kustomize is **built into kubectl** — an overlay-based tool for managing Kubernetes configurations across environments without templating languages. Added to the CKA exam in 2025.

```bash
# Built into kubectl (no install needed)
kubectl apply -k ./overlays/prod/
kubectl kustomize ./overlays/prod/
```

---

# Flow: Kustomize Architecture

```mermaid
graph TD
    BASE["base/\ndeployment.yaml\nservice.yaml\nkustomization.yaml"]

    DEV["overlays/dev/\nkustomization.yaml\nreplicas: 1\nimage: myapp:dev"]
    STG["overlays/staging/\nkustomization.yaml\nreplicas: 2\nimage: myapp:v1.9"]
    PROD["overlays/prod/\nkustomization.yaml\nreplicas: 5\nimage: myapp:v2.0\nnamePrefix: prod-"]

    BASE --> DEV & STG & PROD

    OUT1["kubectl apply -k overlays/dev"]
    OUT2["kubectl apply -k overlays/prod"]

    DEV --> OUT1
    PROD --> OUT2
```

---

# 1. Kustomize vs Helm


> ⚠️ **Notice:** Table content could not be synced from Notion due to integration permission restrictions.

---

# 2. Installation & Setup

```bash
# Already in kubectl (v1.14+)
kubectl version --client | grep GitVersion

# Standalone kustomize binary (optional, newer features)
curl -s https://raw.githubusercontent.com/kubernetes-sigs/kustomize/master/hack/install_kustomize.sh | bash
kustomize version
```

---

# 3. kustomization.yaml — The Control File

Every directory managed by Kustomize needs a `kustomization.yaml` file.

```yaml
# base/kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

# List all resources this kustomization manages
resources:
- deployment.yaml
- service.yaml
- configmap.yaml

# Add labels to ALL resources
commonLabels:
  app: myapp
  managed-by: kustomize

# Add annotations to ALL resources
commonAnnotations:
  team: platform

# Set namespace for ALL resources
namespace: myapp
```

---

# 4. Base Resources

```yaml
# base/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
spec:
  replicas: 1
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
      - name: myapp
        image: myapp:latest
        ports:
        - containerPort: 8080
```

```yaml
# base/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: myapp
spec:
  selector:
    app: myapp
  ports:
  - port: 80
    targetPort: 8080
```

---

# 5. Overlays — Environment Variants

```yaml
# overlays/prod/kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

bases:
- ../../base                         # relative path to base

# Add prefix to ALL resource names
namePrefix: prod-

# Set namespace
namespace: production

# Override image tag
images:
- name: myapp
  newTag: v2.1.0                     # override image:tag
- name: myapp
  newName: registry.company.com/myapp  # override image name
  newTag: v2.1.0

# Patches
patches:
- patch: |-
    - op: replace
      path: /spec/replicas
      value: 5
  target:
    kind: Deployment
    name: myapp
```

```yaml
# overlays/dev/kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

bases:
- ../../base

namespace: dev

images:
- name: myapp
  newTag: dev

patches:
- patch: |-
    - op: replace
      path: /spec/replicas
      value: 1
  target:
    kind: Deployment
    name: myapp
```

---

# 6. Patch Types

## Strategic Merge Patch

```mermaid
flowchart LR
    BASE["Base Deployment\nreplicas: 1\nimage: myapp:latest"]
    PATCH["Strategic Merge Patch\nreplicas: 5\nimage: myapp:v2"]
    RESULT["Final YAML\nreplicas: 5\nimage: myapp:v2\n(other fields kept)"]
    BASE --> RESULT
    PATCH --> RESULT
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

## JSON Patch

```yaml
# Inline JSON patch in kustomization.yaml
patches:
- patch: |-
    - op: replace
      path: /spec/replicas
      value: 5
    - op: add
      path: /spec/template/spec/containers/0/env
      value:
      - name: ENV
        value: production
    - op: remove
      path: /spec/template/spec/containers/0/livenessProbe
  target:
    kind: Deployment
    name: myapp
    namespace: production
```


| Lesson | What You'll Learn |
| --- | --- |
| 14.1 Base & Overlays | Structure your configs for dev, staging, prod |
| 14.2 Patches, ConfigMapGenerator & SecretGenerator | Override specific fields without duplicating YAML |
| 14.3 Kustomize Commands | Build, apply, diff, delete with kubectl -k |

---

# 7. ConfigMapGenerator & SecretGenerator

```yaml
# kustomization.yaml
configMapGenerator:
- name: app-config
  literals:
  - APP_COLOR=blue
  - APP_MODE=production
  files:
  - config.properties              # file contents as value

# Auto-appends hash to name: app-config-abc123def
# Forces pod restart when configmap changes
```

```yaml
secretGenerator:
- name: db-secret
  literals:
  - DB_PASSWORD=mysecret
  type: Opaque
```

```bash
# Disable hash suffix if needed
configMapGenerator:
- name: app-config
  options:
    disableNameSuffixHash: true
  literals:
  - KEY=value
```

---

# 8. Managing Directories

```mermaid
graph TD
    REPO["GitRepo"]
    BASE["base/"]
    ENVS["overlays/"]
    DEV["overlays/dev/"]
    STG["overlays/staging/"]
    PROD["overlays/prod/"]
    COMP["components/\nreusable patches"]

    REPO --> BASE & ENVS & COMP
    ENVS --> DEV & STG & PROD
```

```yaml
# Referencing other directories
resources:
- ../../base
- ../common-configs
- https://github.com/myorg/k8s-base//overlays/prod  # remote base
```

---

# 9. Commands

```bash
# Preview output (don't apply)
kubectl kustomize ./overlays/prod/
kubectl kustomize ./overlays/prod/ > prod-manifests.yaml

# Standalone binary
kustomize build overlays/prod/
kustomize build overlays/prod/ | kubectl apply -f -

# Apply
kubectl apply -k overlays/prod/
kubectl apply -k base/

# Diff before applying
kubectl diff -k overlays/prod/

# Delete resources
kubectl delete -k overlays/prod/

# Edit kustomization (adds resources, patches etc.)
kustomize edit add resource deployment.yaml
kustomize edit set image myapp=myapp:v2.1.0
kustomize edit set namespace production
```

---

# 10. Real-World Example — Full Structure

```javascript
my-app/
├── base/
│   ├── kustomization.yaml
│   ├── deployment.yaml
│   ├── service.yaml
│   └── configmap.yaml
├── overlays/
│   ├── dev/
│   │   ├── kustomization.yaml    # bases + patches
│   │   └── dev-patch.yaml
│   ├── staging/
│   │   └── kustomization.yaml
│   └── prod/
│       ├── kustomization.yaml
│       └── prod-patch.yaml
└── components/
    └── monitoring/               # reusable component
        ├── kustomization.yaml
        └── servicemonitor.yaml
```

```bash
# Deploy to different envs
kubectl apply -k overlays/dev/
kubectl apply -k overlays/staging/
kubectl apply -k overlays/prod/
```

---

# Quick Reference

```bash
# Build / Preview
kubectl kustomize <dir>                    # print rendered YAML
kubectl kustomize <dir> > output.yaml
kustomize build <dir>

# Apply
kubectl apply -k <dir>
kubectl diff -k <dir>                      # preview changes
kubectl delete -k <dir>

# Edit
kustomize edit add resource <file>
kustomize edit set image <name>=<newname>:<tag>
kustomize edit set namespace <ns>

# Kustomization features
# resources:       list of files/dirs to manage
# bases:           parent kustomization dirs
# patches:         strategic merge or JSON patches
# images:          override image names/tags
# namePrefix:      prefix all resource names
# nameSuffix:      suffix all resource names
# namespace:       set namespace on all resources
# commonLabels:    add labels to all resources
# configMapGenerator:  generate ConfigMaps
# secretGenerator:     generate Secrets
```

> 📚 **Ref:** [Kustomize Docs](https://kustomize.io/) | [kubectl kustomize](https://kubernetes.io/docs/tasks/manage-kubernetes-objects/kustomization/)

