---
title: "Brief History"
cert: ["cka"]
roadmap: "core-concepts"
subtopic: "Brief History"
difficulty: "intermediate"
order: 6
tags: ["cka", "core-concepts"]
---

# Brief History
- Kubernetes originally used **Docker** as the only container runtime
- Docker is not just a runtime — it bundles a CLI, API, volumes, auth, build tools, and `containerd` underneath
- Kubernetes introduced the **Container Runtime Interface (CRI)** to support any OCI-compliant runtime
- Docker did not initially support CRI, so Kubernetes created a **dockershim** compatibility shim
- **Dockershim was removed in Kubernetes v1.24**
- Docker images still work — they comply with the **OCI imagespec**
