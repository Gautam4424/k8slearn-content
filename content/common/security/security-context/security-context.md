---
title: "Security Contexts"
cert: ["cka", "ckad", "cks"]
roadmap: security
subtopic: Security Contexts
difficulty: intermediate
order: 5
tags: [securitycontext, capabilities, runasuser, fsgroup]
---

# Pod and Container SecurityContexts

A `securityContext` in Kubernetes defines privilege and access control settings for a Pod or Container. It allows administrators and developers to restrict container operations, enforce non-root execution, manage system group permissions, and control access to the host node's systems.

---

## 📂 SecurityContext Levels

You can configure security contexts at either the **Pod-level** (applies globally to all containers in the Pod) or the **Container-level** (applies strictly to that single container and overrides Pod-level parameters).

```
┌────────────────────────────────────────────────────────┐
│               SECURITY CONTEXT HIERARCHY               │
│                                                        │
│  Pod-Level securityContext (applies to all containers) │
│  spec:                                                 │
│    securityContext:                                    │
│      runAsUser: 1000          ← Set user UID           │
│      runAsGroup: 3000         ← Set group GID          │
│      fsGroup: 2000            ← Set volume GID         │
│      runAsNonRoot: true       ← Deny running as root   │
│                                                        │
│  Container-Level securityContext (overrides pod level) │
│    securityContext:                                    │
│      allowPrivilegeEscalation: false                   │
│      readOnlyRootFilesystem: true     ← Read-only mount│
│      capabilities:                                     │
│        add: ["NET_BIND_SERVICE"]      ← Add privileges │
│        drop: ["ALL"]                  ← Drop privileges│
└────────────────────────────────────────────────────────┘
```

---

## ⚙️ Key Security Parameters

1. **User and Group Ownership (`runAsUser` / `runAsGroup`)**:
   - Forces container processes to run as a specific Linux User ID (UID) and Group ID (GID) instead of the default root user (UID 0).
2. **Supplemental Volumes Group (`fsGroup`)**:
   - When a volume is mounted to the Pod, Kubernetes automatically changes the group ownership of all files inside that volume to match the specified `fsGroup` GID.
3. **Refuse Root Access (`runAsNonRoot: true`)**:
   - Instructs the container runtime (e.g. `containerd`) to validate the image before executing. If the container tries to run with UID 0 (root), the container runtime will reject it and fail to start.
4. **Privilege Escalation Control (`allowPrivilegeEscalation: false`)**:
   - Controls whether a process can gain more privileges than its parent process (e.g., blocks `setuid` binaries or root escalation vectors).
5. **Read-only Filesystems (`readOnlyRootFilesystem: true`)**:
   - Mounts the container's root file system as read-only. This prevents write-based exploit injections; the container can only write files to explicitly mounted writeable volumes (e.g., `emptyDir`).
6. **Linux Capabilities (`capabilities`)**:
   - Fine-tunes kernel-level privileges. You can follow the recommended best practice of dropping all default Linux privileges (`drop: ["ALL"]`) and explicitly adding back only the specific privileges needed (e.g. `add: ["NET_BIND_SERVICE"]` to bind to low ports).

---

## 📄 YAML Manifest Example

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: secure-web-app
  namespace: default
spec:
  # Pod-level: Applies to all containers in the Pod
  securityContext:
    runAsUser: 1000
    runAsGroup: 3000
    fsGroup: 2000
    runAsNonRoot: true
  containers:
  - name: web-server
    image: nginx:alpine-slim
    # Container-level: Applies only to this container, overrides pod-level
    securityContext:
      allowPrivilegeEscalation: false
      readOnlyRootFilesystem: true
      capabilities:
        drop:
        - ALL
        add:
        - NET_BIND_SERVICE     # Allow binding to ports < 1024
    ports:
    - containerPort: 80
```

---

## 🛠️ CLI Operations: Auditing Security Contexts

You can inspect the security settings of running Pods to verify that security controls are properly applied:

```bash
# Get the UID running inside a pod
kubectl exec secure-web-app -- id

# Inspect securityContexts of a running pod
kubectl get pod secure-web-app -o jsonpath='{.spec.securityContext}'
kubectl get pod secure-web-app -o jsonpath='{.spec.containers[*].securityContext}'
```
