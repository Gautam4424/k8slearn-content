# Node Affinity

Node Affinity is the expressive replacement for `nodeSelector`. It supports complex expressions with operators, OR logic, and soft (preferred) constraints.

## Affinity Types

| Type | Scheduling | Running |
|---|---|---|
| `requiredDuringSchedulingIgnoredDuringExecution` | Must match or pod stays Pending | Not re-evaluated |
| `preferredDuringSchedulingIgnoredDuringExecution` | Tries to match, schedules anywhere if not | Not re-evaluated |
| `requiredDuringSchedulingRequiredDuringExecution` | Must match | Pod evicted if node no longer matches (future) |

## Operators

| Operator | Meaning |
|---|---|
| `In` | Value in list |
| `NotIn` | Value NOT in list |
| `Exists` | Key exists (any value) |
| `DoesNotExist` | Key does not exist |
| `Gt` / `Lt` | Greater/less than (numeric string values) |

## Example 1 — Required: Large OR Medium Nodes

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: data-processor
spec:
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
        - matchExpressions:
          - key: size
            operator: In
            values:
            - Large
            - Medium     # OR logic within the values list
  containers:
  - name: processor
    image: data-processor:v2
```

## Example 2 — Required: NOT Small Nodes

```yaml
spec:
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
        - matchExpressions:
          - key: size
            operator: NotIn
            values:
            - Small
```

## Example 3 — Preferred with Weights (Best-Effort)

```yaml
spec:
  affinity:
    nodeAffinity:
      preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 80          # strongly prefer SSD
        preference:
          matchExpressions:
          - key: disk
            operator: In
            values: [ssd]
      - weight: 20          # weakly prefer us-east-1a
        preference:
          matchExpressions:
          - key: topology.kubernetes.io/zone
            operator: In
            values: [us-east-1a]
```

## Example 4 — Exists (GPU label, any value)

```yaml
spec:
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
        - matchExpressions:
          - key: nvidia.com/gpu
            operator: Exists
```

## Fully Dedicated GPU Node (Combined Pattern)

Use **Taints + Labels + Affinity + Tolerations** together for true node dedication:

```bash
# Step 1: Taint GPU nodes — blocks regular workloads
kubectl taint nodes gpu-node-01 hardware=gpu:NoSchedule

# Step 2: Label the GPU nodes
kubectl label nodes gpu-node-01 hardware=gpu
```

```yaml
# Step 3: ML pod uses BOTH toleration + affinity
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
- ML pods → allowed (toleration) AND guaranteed to land there (affinity)

## Taints & Tolerations vs Node Affinity

| | Taints & Tolerations | Node Affinity |
|---|---|---|
| Applied to | Node (taint) + Pod (toleration) | Pod only |
| Prevents other pods? | Yes | No |
| Guarantees target node? | No | Yes (required) |
| Use case | Dedicate / mark nodes | Place pods precisely |
