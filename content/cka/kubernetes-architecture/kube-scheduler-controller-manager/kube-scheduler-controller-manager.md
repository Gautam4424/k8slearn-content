---
title: "kube-scheduler & controller-manager"
cert: ["cka"]
roadmap: "kubernetes-architecture"
subtopic: "kube-scheduler & controller-manager"
difficulty: "intermediate"
order: 3
tags: ["cka"]
---

# kube-scheduler & controller-manager

> Part of **02 ☸️ Kubernetes Architecture** | CKA Chapter 2

---

# kube-scheduler — Where Do Pods Go?

The scheduler watches for pods with no `nodeName` set and assigns them to the best available node.

## Scheduling Pipeline

```mermaid
flowchart TD
    POD(["Unscheduled Pod\nno nodeName set"])
    WATCH["kube-scheduler\nwatches API Server"]
    FILTER["Phase 1: FILTER\nRemove nodes that CANNOT run this pod\n\n• NodeResourcesFit (not enough CPU/memory)\n• TaintToleration (node tainted, pod has no toleration)\n• NodeAffinity (node doesn't match affinity rules)\n• VolumeBinding (volume zone mismatch)\n• PodTopologySpread (would violate spread constraints)"]
    SCORE["Phase 2: SCORE\nRank remaining nodes 0–100\n\n• LeastAllocated (prefer less busy nodes)\n• BalancedAllocation (balance CPU vs memory)\n• ImageLocality (prefer nodes with image cached)\n• InterPodAffinity (prefer nodes near affinity pods)"]
    WIN(["Highest score node wins"])
    BIND["BIND\nWrite nodeName to Pod spec via API Server → etcd"]
    KL["kubelet on that node\npulls image + starts containers"]
    POD --> WATCH --> FILTER --> SCORE --> WIN --> BIND --> KL
```

## Scheduler Extension Points

```mermaid
flowchart LR
    QS["QueueSort"] --> PF["PreFilter"] --> F["Filter\n❌ eliminate"]
    F --> POF["PostFilter\npreemption"] --> PS["PreScore"] --> SC["Score\n🏆 rank"]
    SC --> RES["Reserve"] --> PER["Permit"] --> PB["PreBind"] --> B["Bind"] --> POB["PostBind"]
```

```bash
# View scheduler static pod
cat /etc/kubernetes/manifests/kube-scheduler.yaml

# Check scheduler logs
kubectl logs -n kube-system kube-scheduler-controlplane

# Why is a pod Pending? (scheduler couldn't place it)
kubectl describe pod <pending-pod> | grep -A10 Events
```

---

# kube-controller-manager — The Reconciliation Engine

Runs all **control loops** inside a single binary. Each controller watches the API Server and drives the cluster toward the desired state.

## Reconciliation Loop (how every controller works)

```mermaid
flowchart TD
    WATCH["Watch API Server\nfor resource changes"]
    DIFF["Compute diff\ndesired state vs actual state"]
    ACT["Take corrective action\ncreate / delete / update resources"]
    STATUS["Update status\nvia API Server"]
    WATCH --> DIFF --> ACT --> STATUS --> WATCH
```

## Key Controllers

```bash
# View controller-manager static pod
cat /etc/kubernetes/manifests/kube-controller-manager.yaml

# Check logs
kubectl logs -n kube-system kube-controller-manager-controlplane
```

