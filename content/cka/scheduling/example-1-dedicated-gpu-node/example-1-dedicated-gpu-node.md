---
title: "Example 1 — Dedicated GPU Node"
cert: ["cka"]
roadmap: "scheduling"
subtopic: "Example 1 — Dedicated GPU Node"
difficulty: "intermediate"
order: 13
tags: ["cka", "scheduling"]
---

# Example 1 — Dedicated GPU Node
```bash
# Taint the GPU node — blocks all non-GPU workloads
kubectl taint nodes gpu-node-01 hardware=gpu:NoSchedule

# Verify
kubectl describe node gpu-node-01 | grep -i taint
# Taints: hardware=gpu:NoSchedule
```

```yaml
# GPU pod with matching toleration — allowed on gpu-node-01
apiVersion: v1
kind: Pod
metadata:
  name: ml-training-job
spec:
  tolerations:
  - key: "hardware"
    operator: "Equal"
    value: "gpu"
    effect: "NoSchedule"
  containers:
  - name: trainer
    image: tensorflow/tensorflow:latest-gpu
    resources:
      limits:
        nvidia.com/gpu: 1
```
