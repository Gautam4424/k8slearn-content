---
title: "5.6 TopologySpreadConstraints & PriorityClass"
---
# 5.6 TopologySpreadConstraints & PriorityClass

> Part of **05 📅 Scheduling** | CKA Chapter 5

---

# TopologySpreadConstraints

Spread pods evenly across **zones, nodes, or any topology key** — prevents all replicas landing on one node/zone.

```mermaid
flowchart LR
    subgraph Z1["Zone us-east-1a (2 pods)"]
        P1["Pod"] & P2["Pod"]
    end
    subgraph Z2["Zone us-east-1b (2 pods)"]
        P3["Pod"] & P4["Pod"]
    end
    TSC["TopologySpreadConstraint\nmaxSkew=1 across zones"]
    TSC --> Z1 & Z2
    style TSC fill:#dbeafe,stroke:#3b82f6
```

```yaml
spec:
  topologySpreadConstraints:
  - maxSkew: 1
    topologyKey: topology.kubernetes.io/zone
    whenUnsatisfiable: DoNotSchedule
    labelSelector:
      matchLabels:
        app: web
  - maxSkew: 1
    topologyKey: kubernetes.io/hostname
    whenUnsatisfiable: ScheduleAnyway
    labelSelector:
      matchLabels:
        app: web
```

[Table Not Rendered - Unsupported Block]

---

# PriorityClass

Control which pods get scheduled first and which get **evicted first** under resource pressure.

```mermaid
flowchart TD
    PC_H["PriorityClass: critical\nvalue: 1000000"] --> P_H["Critical Pod"]
    PC_L["PriorityClass: batch\nvalue: 100"] --> P_L["Batch Pod"]
    NODE["Node at capacity"]
    P_H -->|needs resources| NODE
    NODE -->|evicts lower priority| P_L
    style PC_H fill:#fee2e2,stroke:#ef4444
    style PC_L fill:#d1fae5,stroke:#10b981
```

```yaml
apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: critical-priority
value: 1000000
globalDefault: false
preemptionPolicy: PreemptLowerPriority
description: "Critical production workloads"
---
# Use in Pod
spec:
  priorityClassName: critical-priority
  containers:
  - name: app
    image: myapp:v2
```

```bash
kubectl get priorityclasses
# System built-ins (never delete):
# system-cluster-critical  → CoreDNS, kube-proxy
# system-node-critical     → static pods
```

