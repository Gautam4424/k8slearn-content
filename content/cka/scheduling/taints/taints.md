# Taints and tolerations

A taint is applied to a node to repel pods from being scheduled there unless
the pod explicitly tolerates it.

## Applying a taint

```bash
kubectl taint nodes node1 gpu=true:NoSchedule
```

## How tolerations work

A toleration is defined in the pod spec and allows a pod to be scheduled
on a tainted node.

```yaml
tolerations:
  - key: "gpu"
    operator: "Equal"
    value: "true"
    effect: "NoSchedule"
```

## Taint effects

| Effect | Behaviour |
|---|---|
| `NoSchedule` | New pods will not be scheduled on the node |
| `PreferNoSchedule` | Scheduler avoids the node but can use it |
| `NoExecute` | New pods rejected and existing pods evicted |

## Common use cases

- Dedicated nodes for GPU workloads
- Reserving nodes for system components
- Draining a node gradually with `NoExecute`
