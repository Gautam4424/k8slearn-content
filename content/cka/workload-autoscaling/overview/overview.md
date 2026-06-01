---
title: "Overview"
cert: ["cka"]
roadmap: "workload-autoscaling"
subtopic: "Overview"
difficulty: "intermediate"
order: 1
tags: ["cka", "workload-autoscaling"]
---

# Overview
> **Source:** CKA 2025/2026 Exam Curriculum | 📅 June 2026

All mechanisms for automatically scaling workloads in Kubernetes — HPA (horizontal), VPA (vertical), and KEDA (event-driven).

---

# 1. HorizontalPodAutoscaler (HPA)

Automatically scales **the number of pod replicas** based on observed CPU, memory, or custom metrics.

```mermaid
flowchart TD
    MS["Metrics Server\nscraped every 15s"]
    HPA["HPA Controller\nchecks every 15s"]
    CURR["Current: 2 pods\nCPU: 80%"]
    TARGET["Target CPU: 50%"]
    CALC["Desired replicas = ceil(2 * 80/50) = 4"]
    DEPLOY["Deployment\nscaled to 4 replicas"]

    MS --> HPA
    CURR --> HPA
    TARGET --> HPA
    HPA --> CALC --> DEPLOY

    style HPA fill:#dbeafe,stroke:#3b82f6
    style DEPLOY fill:#d1fae5,stroke:#10b981
```
