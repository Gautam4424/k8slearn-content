> **Source:** [KodeKloud CKA Course — 02-Core-Concepts](https://github.com/kodekloudhub/certified-kubernetes-administrator-course/tree/master/docs/02-Core-Concepts) | 📅 Created: May 2026

# Docker vs containerd

## Brief History

- Kubernetes originally used **Docker** as the only container runtime
- Docker is not just a runtime — it bundles a CLI, API, volumes, auth, build tools, and `containerd` underneath
- Kubernetes introduced the **Container Runtime Interface (CRI)** to support any OCI-compliant runtime
- Docker did not initially support CRI, so Kubernetes created a **dockershim** compatibility shim
- **Dockershim was removed in Kubernetes v1.24**
- Docker images still work — they comply with the **OCI imagespec**

## containerd

- `containerd` is a **CNCF-graduated** project, spun out of Docker
- It is the default container runtime in most modern Kubernetes distributions
- Ships with CLI tools:
    - `ctr` — low-level containerd CLI (not user-friendly, for debugging)
    - `nerdctl` — Docker-compatible CLI for containerd (supports Compose, lazy-pull, etc.)
    - `crictl` — CRI-compatible CLI maintained by the Kubernetes community (works with any CRI runtime)

## CLI Comparison

| Tool | Runtime | Use Case |
| --- | --- | --- |
| `docker` | Docker (dockerd) | Docker environments |
| `ctr` | containerd | Low-level containerd debugging |
| `nerdctl` | containerd | Docker-compatible day-to-day use |
| `crictl` | Any CRI runtime | Kubernetes node debugging |

```bash
# Pull and run with ctr
ctr images pull docker.io/library/nginx:latest
ctr run docker.io/library/nginx:latest nginx

# crictl — works like docker but talks to CRI
crictl pull nginx
crictl ps
crictl logs <container-id>
crictl pods
```

> ⚠️ `crictl` is for **debugging only** — do not use it to create pods in production. Kubelet may delete unknown containers.