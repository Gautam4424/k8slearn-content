---
title: "Configuration"
cert: ["cka"]
roadmap: "core-concepts"
subtopic: "Configuration"
difficulty: "intermediate"
order: 22
tags: ["cka", "core-concepts"]
---

# Configuration
```bash
# kubeadm
cat /etc/kubernetes/manifests/kube-controller-manager.yaml

# Manual
cat /etc/systemd/system/kube-controller-manager.service

# View running process
ps aux | grep kube-controller-manager
```
