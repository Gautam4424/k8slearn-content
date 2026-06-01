---
title: "HPA vs VPA"
cert: ["cka"]
roadmap: "workload-autoscaling"
subtopic: "HPA vs VPA"
difficulty: "intermediate"
order: 7
tags: ["cka", "workload-autoscaling"]
---

# HPA vs VPA
[Table Placeholder]

---

# 3. Cluster Autoscaler

Adds or removes **nodes** from the cluster when pods are unschedulable or nodes are underutilized.

```mermaid
flowchart TD
    PEND["Pending Pods\n(no nodes have capacity)"]
    CA["Cluster Autoscaler"]
    ADD["Add node to NodeGroup\n(cloud provider API)"]
    SCHED["kube-scheduler\nnow places pods"]

    UNDER["Underutilized nodes\n< 50% used for 10min"]
    REMOVE["Drain + remove node"]

    PEND --> CA --> ADD --> SCHED
    UNDER --> CA --> REMOVE

    style CA fill:#dbeafe,stroke:#3b82f6
    style ADD fill:#d1fae5,stroke:#10b981
    style REMOVE fill:#fee2e2,stroke:#ef4444
```

```bash
# Cluster Autoscaler runs as a Deployment in kube-system
kubectl get deployment cluster-autoscaler -n kube-system

# View logs to see scaling decisions
kubectl logs -n kube-system deployment/cluster-autoscaler | grep -i scale

# Annotate node to prevent scale-down
kubectl annotate node node01 \
  cluster-autoscaler.kubernetes.io/scale-down-disabled=true

# Check why a node won't be removed
kubectl describe node node01 | grep -i autoscaler
```

---

# Quick Reference

```bash
# HPA
kubectl autoscale deployment myapp --cpu-percent=50 --min=2 --max=10
kubectl get hpa
kubectl get hpa -w                  # watch in real time
kubectl describe hpa myapp
kubectl delete hpa myapp

# VPA
kubectl get vpa
kubectl describe vpa myapp-vpa
kubectl get vpa myapp-vpa -o yaml | grep -A20 recommendation

# Metrics (required for HPA)
kubectl top pods
kubectl top nodes
kubectl get --raw /apis/metrics.k8s.io/v1beta1/pods
```

> 📚 **Ref:** [HPA Docs](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/) | [VPA Repo](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler)
