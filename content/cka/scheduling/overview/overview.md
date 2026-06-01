---
title: "Overview"
cert: ["cka"]
roadmap: "scheduling"
subtopic: "Overview"
difficulty: "intermediate"
order: 1
tags: ["cka", "scheduling"]
---

# Overview
This document covers every topic from the **Scheduling** section of the CKA course — how Kubernetes decides where pods run, and all the mechanisms to influence that decision. Every section includes **real-world examples** with full YAML and commands.

---

# Scheduling Overview

The **kube-scheduler** is responsible for assigning pods to nodes. When a pod is created without a `nodeName`, the scheduler picks the best node through a two-phase pipeline: **Filter → Score**.

```mermaid
flowchart TD
    POD(["Pod Created - no nodeName"])
    WATCH["kube-scheduler watches API"]
    FILTER["Phase 1: FILTER\nNodeResourcesFit · TaintToleration\nNodeAffinity · VolumeBinding"]
    SCORE["Phase 2: SCORE\nNodeResourcesBalancedAllocation\nImageLocality · InterPodAffinity"]
    WIN(["Highest score node wins"])
    BIND["BIND - write nodeName to pod spec"]
    KL["kubelet pulls image + starts containers"]
    POD --> WATCH --> FILTER --> SCORE --> WIN --> BIND --> KL
    style FILTER fill:#fef3c7,stroke:#f59e0b
    style SCORE fill:#d1fae5,stroke:#10b981
    style BIND fill:#dbeafe,stroke:#3b82f6
```

---

# 1. Manual Scheduling
