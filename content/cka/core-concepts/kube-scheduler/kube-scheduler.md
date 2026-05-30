> **Source:** [KodeKloud CKA Course — 02-Core-Concepts](https://github.com/kodekloudhub/certified-kubernetes-administrator-course/tree/master/docs/02-Core-Concepts) | 📅 Created: May 2026

# kube-scheduler

## Role

The scheduler **decides which node** a Pod should run on. It does **not** actually start the pod — that's kubelet's job.

## Scheduling Process (2 Phases)

### Phase 1: Filter

Eliminate nodes that cannot run the pod:
- Insufficient CPU/memory
- Node doesn't match `nodeSelector` or taints/tolerations
- Node is NotReady

### Phase 2: Score / Rank

Rank remaining nodes using priority functions:
- Resource availability
- Affinity/anti-affinity rules
- Spread constraints

The node with the **highest score** wins.

## Configuration

```bash
# kubeadm
cat /etc/kubernetes/manifests/kube-scheduler.yaml

# Manual
cat /etc/systemd/system/kube-scheduler.service

# Check running process
ps aux | grep kube-scheduler
```

> The scheduler is **pluggable** — you can write custom schedulers and use them alongside the default one.