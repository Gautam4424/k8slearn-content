---
title: "SecurityContext & Pod Security Admission"
cert: ["cka"]
roadmap: "security"
subtopic: "SecurityContext & Pod Security Admission"
difficulty: "intermediate"
order: 4
tags: ["cka"]
---

# SecurityContext & Pod Security Admission

> Part of **09 🔒 Security** | CKA Chapter 9

---

# SecurityContext — Harden Containers

```mermaid
flowchart TD
    subgraph POD_SC["Pod-level securityContext"]
        P1["runAsUser: 1000"]
        P2["runAsNonRoot: true"]
        P3["fsGroup: 2000"]
    end
    subgraph CTR_SC["Container-level (overrides pod)"]
        C1["allowPrivilegeEscalation: false"]
        C2["readOnlyRootFilesystem: true"]
        C3["capabilities.drop: ALL"]
    end
```

```yaml
apiVersion: v1
kind: Pod
spec:
  securityContext:
    runAsUser: 1000
    runAsGroup: 3000
    fsGroup: 2000
    runAsNonRoot: true
  containers:
  - name: app
    image: myapp:v2
    securityContext:
      allowPrivilegeEscalation: false
      readOnlyRootFilesystem: true
      capabilities:
        drop: ["ALL"]
        add: ["NET_BIND_SERVICE"]
```

---

# Pod Security Admission (PSA)

Enforces **Pod Security Standards** via namespace labels — no webhooks needed. Replaced PodSecurityPolicy (removed v1.25).

```mermaid
flowchart TD
    NS["Namespace labels\ndefine enforcement level"]
    PRIV["privileged\nNo restrictions"]
    BASE["baseline\nBlocks hostNetwork\nprivileged containers"]
    REST["restricted\nNon-root, drop ALL caps\nread-only FS, seccomp"]
    NS --> PRIV & BASE & REST
```

```bash
# Enforce restricted standard on a namespace
kubectl label namespace production \
  pod-security.kubernetes.io/enforce=restricted \
  pod-security.kubernetes.io/enforce-version=v1.31 \
  pod-security.kubernetes.io/warn=restricted \
  pod-security.kubernetes.io/audit=restricted

# Mode: enforce=hard block | warn=allow+warn | audit=allow+log
```

