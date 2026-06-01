---
title: "Authentication"
cert: ["cka", "ckad", "cks"]
roadmap: security
subtopic: Authentication
difficulty: intermediate
order: 1
tags: [authentication, serviceaccounts, tokens, oidc, users]
---

# Authentication in Kubernetes

Authentication is the first line of defense in securing a Kubernetes cluster. It answers the fundamental question: **Who is making the request?**

---

## 🏗️ Kubernetes Security Layers

Securing a Kubernetes cluster involves multiple security layers, spanning from the base virtual/physical nodes up to the application workloads.

```mermaid
flowchart TD
    subgraph L1["🏗️ Layer 1: Infrastructure"]
        INF["Network segmentation\nFirewalls · SSH keys · Node hardening"]
    end
    subgraph L2["🔐 Layer 2: Cluster API"]
        direction LR
        A["Authentication\nWho are you?"] --> B["Authorization RBAC\nWhat can you do?"] --> C["Admission Controllers\nAre requests valid?"]
    end
    subgraph L3["📦 Layer 3: Workload"]
        SC["SecurityContext"]
        NP["NetworkPolicy"]
        SEC["Secrets"]
        IMG["Image Policy"]
    end
    L1 --> L2 --> L3

    style L1 fill:#451a03,stroke:#f59e0b,color:#fef3c7
    style L2 fill:#1e3a8a,stroke:#3b82f6,color:#dbeafe
    style L3 fill:#064e3b,stroke:#10b981,color:#d1fae5
```

---

## 👥 Humans vs. Machines

Kubernetes distinguishes between two categories of users: **Human Users** (acting outside the cluster, such as administrators and developers) and **ServiceAccounts** (representing in-cluster workload identities).

```mermaid
flowchart TD
    subgraph METHODS["☸️ AUTHENTICATION METHODS"]
        direction TB
        subgraph HUMANS["👥 Humans (External)"]
            HC["Client Certificates\nStatic Token Files\nOIDC (Dex, Keycloak)\nWebhook"]
        end
        subgraph MACHINES["🤖 Machines (Internal)"]
            MC["ServiceAccount Tokens\nTokenVolumeProjection\nTokenRequest API"]
        end
    end

    style HUMANS fill:#1e3a8a,stroke:#3b82f6,color:#dbeafe
    style MACHINES fill:#14532d,stroke:#22c55e,color:#dcfce7
    style METHODS fill:#0f172a,stroke:#64748b,color:#e2e8f0
```

> ⚠️ **Key Difference:** Kubernetes does **not** have database records or objects representing human users natively inside etcd. Instead, human identities are verified through external mechanisms (e.g. usernames extracted from certificate Common Names or OIDC token claims). Only `ServiceAccounts` are managed as actual resources within the cluster.

---

## 🔄 How Authentication Works

Every HTTP request sent to the `kube-apiserver` must be authenticated. The API server evaluates requests by applying a set of enabled authenticator plugins:

1. **X.509 Client Certificates**: The API server validates certificates signed by the cluster's trusted Root Certificate Authority (CA). The user's name is extracted from the `CN` (Common Name) field, and groups are extracted from `O` (Organization) fields.
2. **OpenID Connect (OIDC) Tokens**: Integrates with external Single Sign-On (SSO) providers (e.g., Google, GitHub, Dex, Keycloak) using JSON Web Tokens (JWT).
3. **Webhook Token Authentication**: Delegates token verification to an external HTTP webhook API.
4. **ServiceAccount Tokens**: Pods carry auto-mounted JSON Web Tokens (JWT) representing their ServiceAccount, allowing them to communicate securely with the API server.

---

## ⚙️ ServiceAccount Configuration

Workloads communicate with the API server by assuming a **ServiceAccount** identity. 

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: monitoring-sa
  namespace: default
```

When a Pod runs, it mounts a token from this ServiceAccount at a default path:
`/var/run/secrets/kubernetes.io/serviceaccount/token`

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: monitor-app
  namespace: default
spec:
  serviceAccountName: monitoring-sa
  containers:
  - name: app
    image: prom/prometheus:v2.45.0
```

---

## 🛠️ CLI Quick Reference

```bash
# Create a new ServiceAccount
kubectl create serviceaccount web-analyzer

# View the details of a ServiceAccount
kubectl describe serviceaccount web-analyzer

# Request a temporary token manually for a ServiceAccount (TokenRequest API)
kubectl create token web-analyzer --duration=1h

# Check who you are authenticated as currently
kubectl auth can-i --list
```
