---
title: "Example — Fully Dedicated GPU Node (Real-World Pattern)"
cert: ["cka"]
roadmap: "scheduling"
subtopic: "Example — Fully Dedicated GPU Node (Real-World Pattern)"
difficulty: "intermediate"
order: 25
tags: ["cka", "scheduling"]
---

# Example — Fully Dedicated GPU Node (Real-World Pattern)
**Scenario:** 2 GPU nodes. ML jobs must ONLY run there; no regular workloads allowed.

```bash
# Step 1: Taint GPU nodes — blocks regular workloads
kubectl taint nodes gpu-node-01 hardware=gpu:NoSchedule
kubectl taint nodes gpu-node-02 hardware=gpu:NoSchedule

# Step 2: Label the GPU nodes
kubectl label nodes gpu-node-01 hardware=gpu
kubectl label nodes gpu-node-02 hardware=gpu
```

```yaml
# Step 3: ML pod uses BOTH toleration + affinity
apiVersion: v1
kind: Pod
metadata:
  name: ml-training
spec:
  tolerations:             # allows pod past the taint
  - key: "hardware"
    operator: "Equal"
    value: "gpu"
    effect: "NoSchedule"
  affinity:                # guarantees pod goes to GPU node
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
        - matchExpressions:
          - key: hardware
            operator: In
            values: ["gpu"]
  containers:
  - name: trainer
    image: tensorflow/tensorflow:latest-gpu
```

**Result:**

- Regular pods → blocked from GPU nodes (taint)
- ML pods → allowed on GPU nodes (toleration) AND guaranteed to go there (affinity)
---

# 7. Resource Limits
