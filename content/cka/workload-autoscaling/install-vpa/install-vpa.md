---
title: "Install VPA"
cert: ["cka"]
roadmap: "workload-autoscaling"
subtopic: "Install VPA"
difficulty: "intermediate"
order: 4
tags: ["cka", "workload-autoscaling"]
---

# Install VPA
```bash
# VPA is NOT built in — install separately
git clone https://github.com/kubernetes/autoscaler.git
cd autoscaler/vertical-pod-autoscaler
./hack/vpa-install.sh

# Verify
kubectl get pods -n kube-system | grep vpa
# vpa-admission-controller-xxx   Running
# vpa-recommender-xxx            Running
# vpa-updater-xxx                Running
```
