---
title: "2.2 kube-apiserver & etcd"
cert: ["cka"]
roadmap: "02-kubernetes-architecture-complete-reference"
subtopic: "2.2 kube-apiserver & etcd"
difficulty: "intermediate"
order: 2
tags: ["cka"]
---

# 2.2 kube-apiserver & etcd

> Part of **02 ☸️ Kubernetes Architecture** | CKA Chapter 2

---

# kube-apiserver — The Front Door

Every single operation in Kubernetes goes through the API server. It is the **only** component that reads and writes to etcd.

## What it does

* Exposes the Kubernetes REST API on port `6443`
* Authenticates every request (who are you?)
* Authorizes every request (are you allowed?)
* Runs admission controllers (should this be allowed/modified?)
* Persists validated objects to etcd
* Notifies watching components via the Watch API
## API Request Flow

```mermaid
flowchart TD
    CLI["kubectl / SDK / controller"]
    AUTH["1. Authentication\nWho are you?\ncerts · tokens · OIDC"]
    AUTHZ["2. Authorization\nAre you allowed?\nRBAC check"]
    MUT["3. Mutating Admission\nRuns FIRST — can modify object\nDefaultStorageClass · LimitRanger · webhooks"]
    VAL["4. Validating Admission\nRuns AFTER — allow or deny only\nNamespaceLifecycle · ResourceQuota · PSA"]
    ETCD[("5. Persist to etcd ✅")]
    RESP["6. Return response to client"]
    CLI --> AUTH --> AUTHZ --> MUT --> VAL --> ETCD --> RESP
```

> ⚠️ **Mutating webhooks ALWAYS run before Validating webhooks.** Validators see the final mutated object.

## Key Facts

* Stateless → can run multiple replicas behind a load balancer (HA setup)
* Uses **Watch API** — components register watches, get push notifications on changes
* Exposed via HTTPS only — client must present a valid certificate
```bash
# Check if API server is healthy
curl -k https://localhost:6443/healthz

# View API server static pod manifest
cat /etc/kubernetes/manifests/kube-apiserver.yaml

# View API server logs
kubectl logs -n kube-system kube-apiserver-controlplane
```

---

# etcd — The Source of Truth

etcd is a **distributed key-value store** using the Raft consensus algorithm. It stores 100% of cluster state.

## What gets stored in etcd?

Everything — pods, deployments, services, configmaps, secrets, nodes, RBAC rules, custom resources.

```mermaid
graph LR
    R["/registry/"]
    R --> NS["namespaces/default"]
    R --> PO["pods/default/nginx"]
    R --> DP["deployments/apps/default/web"]
    R --> SV["services/default/web-svc"]
    R --> SE["secrets/default/db-secret"]
    R --> NO["nodes/node01"]
```

## Raft Consensus — How HA etcd Works

```mermaid
flowchart LR
    E1[("etcd #1\nLEADER")] <-->|Raft replicate| E2[("etcd #2\nFollower")]
    E1 <-->|Raft replicate| E3[("etcd #3\nFollower")]
    API["kube-apiserver"] -->|write| E1
    E1 -->|committed when majority agrees| DONE["Write committed ✅"]
```

> ✅ Always use **odd numbers** of etcd nodes. 3 is the minimum for production.

## Key Facts

* Only `kube-apiserver` talks to etcd directly
* Strongly consistent — reads always return the latest committed value
* Runs on port `2379` (client) and `2380` (peer)
```bash
# Check etcd health
export ETCDCTL_API=3
etcdctl endpoint health \
  --endpoints=https://127.0.0.1:2379 \
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \
  --cert=/etc/kubernetes/pki/etcd/server.crt \
  --key=/etc/kubernetes/pki/etcd/server.key

# List all keys stored in etcd
etcdctl get / --prefix --keys-only \
  --endpoints=https://127.0.0.1:2379 \
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \
  --cert=/etc/kubernetes/pki/etcd/server.crt \
  --key=/etc/kubernetes/pki/etcd/server.key

# View etcd static pod
cat /etc/kubernetes/manifests/etcd.yaml
```

