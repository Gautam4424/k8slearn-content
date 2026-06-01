---
title: "1.3 kube-scheduler"
cert: ["cka"]
roadmap: "k8s-architecture"
subtopic: "1.3 kube-scheduler"
difficulty: "intermediate"
order: 6
tags: ["cka", "k8s-architecture"]
---

# 1.3 kube-scheduler
> Decides **which node** a newly created Pod should run on.

**Scheduling Pipeline:**

```mermaid
flowchart TD
    POD(["Unscheduled Pod"])
    F["Filtering Phase\nRemove nodes failing hard constraints\nresources · taints · node affinity\nVolumeBinding · PodTopologySpread"]
    S["Scoring Phase\nRank remaining nodes\nLeastAllocated · BalancedAllocation\nImageLocality · InterPodAffinity"]
    B["Bind Phase\nWrite nodeName to Pod spec via API Server"]
    POD --> F --> S --> B
    style F fill:#fef3c7,stroke:#f59e0b
    style S fill:#d1fae5,stroke:#10b981
    style B fill:#dbeafe,stroke:#3b82f6
```

**Filtering plugins:** NodeResourcesFit, NodeAffinity, TaintToleration, PodTopologySpread, VolumeBinding

**Scoring plugins:** LeastAllocated, BalancedAllocation, ImageLocality, InterPodAffinity

---
