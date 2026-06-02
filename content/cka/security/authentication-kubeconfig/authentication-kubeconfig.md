---
title: "Authentication & kubeconfig"
cert: ["cka"]
roadmap: "security"
subtopic: "Authentication & kubeconfig"
difficulty: "intermediate"
order: 1
tags: ["cka"]
---

# Authentication & kubeconfig

> Part of **09 🔒 Security** | CKA Chapter 9

---

# Authentication — Who Are You?

```mermaid
flowchart TD
    subgraph HUMANS["Humans"]
        H1["Client Certificates\nkubectl via ~/.kube/config"]
        H2["OIDC Tokens\nSSO via Dex/Keycloak"]
    end
    subgraph MACHINES["In-cluster Apps"]
        M1["ServiceAccount Tokens\nauto-mounted in pods"]
    end
    API["kube-apiserver"]
    H1 & H2 & M1 --> API
```

> K8s does **not** manage human users natively. It relies on certs or OIDC. Only **ServiceAccounts** are native K8s objects.

---

# kubeconfig — How kubectl Knows Where to Connect

```mermaid
flowchart LR
    KC["kubeconfig file\n~/.kube/config"]
    CL["clusters:\nWHERE to connect\nhttps://api-server:6443"]
    US["users:\nWHO is connecting\nclient cert + key"]
    CT["contexts:\nWHO connects to WHERE\nuser@cluster"]
    KC --> CL & US & CT
```

```bash
# View current config
kubectl config view

# List contexts (cluster + user combos)
kubectl config get-contexts

# Switch context
kubectl config use-context prod-admin

# Set default namespace for current context
kubectl config set-context --current --namespace=production

# Merge multiple kubeconfigs
export KUBECONFIG=~/.kube/config:~/.kube/dev-config
kubectl config view --flatten > ~/.kube/merged
```

