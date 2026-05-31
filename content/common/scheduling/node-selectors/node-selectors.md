# Node Selectors

`nodeSelector` is the simplest way to constrain pods to specific nodes using **exact label equality**.

## Example 1 — High-Memory Workload on Specific Node

```bash
# Step 1: Label the target node
kubectl label nodes node-highmem-01 size=large
```

```yaml
# Step 2: Pod spec with nodeSelector
apiVersion: v1
kind: Pod
metadata:
  name: memory-intensive-app
spec:
  nodeSelector:
    size: large
  containers:
  - name: app
    image: bigdata-processor:v3
    resources:
      requests:
        memory: "16Gi"
```

## Example 2 — SSD-Only Database Pod

```bash
kubectl label nodes node-ssd-01 disk=ssd
kubectl label nodes node-ssd-02 disk=ssd
```

```yaml
spec:
  nodeSelector:
    disk: ssd
  containers:
  - name: db
    image: postgres:15
```

## Viewing Node Labels

```bash
# Show all labels on nodes
kubectl get nodes --show-labels

# Describe a specific node's labels
kubectl describe node <node-name> | grep Labels -A20

# Find nodes with a specific label
kubectl get nodes -l size=large
```

## Limitations

`nodeSelector` only supports **exact equality**. It cannot express:
- OR conditions (`size=large OR size=xlarge`)
- NOT conditions (`size != small`)
- Complex expressions

For these use cases, use **Node Affinity**.

## nodeSelector vs Node Affinity

| Feature | nodeSelector | Node Affinity |
|---|---|---|
| Syntax | Simple key=value | matchExpressions with operators |
| OR logic | ❌ | ✅ (`In` with multiple values) |
| NOT logic | ❌ | ✅ (`NotIn`, `DoesNotExist`) |
| Soft preference | ❌ | ✅ (`preferred` type) |
| Exists check | ❌ | ✅ (`Exists` operator) |
