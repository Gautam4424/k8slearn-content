---
title: "Setup: kubeadm vs Manual"
cert: ["cka"]
roadmap: "core-concepts"
subtopic: "Setup: kubeadm vs Manual"
difficulty: "intermediate"
order: 13
tags: ["cka", "core-concepts"]
---

# Setup: kubeadm vs Manual
[Table Placeholder]

```bash
# kubeadm: inspect the etcd pod
kubectl get pods -n kube-system | grep etcd

# Query etcd directly (from within the etcd pod)
kubectl exec -it etcd-master -n kube-system -- sh
etcdctl get / --prefix --keys-only

# Kubernetes stores data under: /registry/<resource-type>/<namespace>/<name>
```
