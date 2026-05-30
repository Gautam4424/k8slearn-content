> **Source:** [KodeKloud CKA Course — 02-Core-Concepts](https://github.com/kodekloudhub/certified-kubernetes-administrator-course/tree/master/docs/02-Core-Concepts) | 📅 Created: May 2026

# kube-controller-manager

## What is a Controller?

A controller is a **control loop** that watches the current state of the cluster and makes changes to move it toward the **desired state**.

> Analogy: Like a ship's watch officer — continuously monitors the situation and takes corrective action.

## Key Controllers

| Controller | What It Manages |
| --- | --- |
| **Node Controller** | Monitors node health; marks unreachable after 40s, evicts pods after 5min |
| **Replication Controller** | Ensures desired number of pod replicas exist |
| **Endpoints Controller** | Populates Endpoints objects (joining Services & Pods) |
| **ServiceAccount & Token Controllers** | Creates default accounts and API access tokens |
| **Namespace Controller** | Handles namespace lifecycle |
| **Deployment Controller** | Manages rolling updates, rollbacks |
| **Job Controller** | Manages batch jobs |
| **CronJob Controller** | Manages scheduled jobs |

All controllers are **compiled into a single binary**: `kube-controller-manager`.

## Configuration

```bash
# kubeadm
cat /etc/kubernetes/manifests/kube-controller-manager.yaml

# Manual
cat /etc/systemd/system/kube-controller-manager.service

# View running process
ps aux | grep kube-controller-manager
```

## Important Flags

| Flag | Default | Meaning |
| --- | --- | --- |
| `--node-monitor-period` | 5s | How often to check node status |
| `--node-monitor-grace-period` | 40s | Wait before marking node unhealthy |
| `--pod-eviction-timeout` | 5m | Wait before evicting pods from unhealthy node |
| `--controllers` | `*` | Which controllers to enable |