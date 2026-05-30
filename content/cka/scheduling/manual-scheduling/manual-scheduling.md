# Manual Scheduling

## How Scheduling Works Internally

Every pod spec has a `nodeName` field — empty by default. The scheduler fills it in. If you fill it yourself, the scheduler **skips that pod entirely**.

## Example 1 — Manually Assign at Creation

```yaml
# manual-pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-manual
spec:
  nodeName: node01        # scheduler bypassed entirely
  containers:
  - name: nginx
    image: nginx:1.25
    ports:
    - containerPort: 80
```

```bash
kubectl apply -f manual-pod.yaml
kubectl get pods -o wide
# NAME           READY   STATUS    NODE
# nginx-manual   1/1     Running   node01
```

> ⚠️ `nodeName` can only be set **at pod creation time**. To move an existing pod use `kubectl replace --force -f pod.yaml`.

## Example 2 — Binding API for an Already-Pending Pod

If the scheduler is down and you have a pending pod, you can force-assign it using the Binding API:

```bash
curl -X POST \
  http://$SERVER/api/v1/namespaces/default/pods/$PODNAME/binding \
  -H "Content-Type: application/json" \
  -d '{
    "apiVersion": "v1",
    "kind": "Binding",
    "metadata": {"name": "nginx"},
    "target": {"apiVersion": "v1", "kind": "Node", "name": "node02"}
  }'
```

## Example 3 — Diagnosing a Pending Pod

```bash
# Find why a pod is stuck in Pending
kubectl describe pod nginx-pending
# Events:
#   Warning  FailedScheduling  30s  default-scheduler
#            0/3 nodes available: 3 Insufficient memory.

# If Events section is empty — scheduler is likely down
kubectl get pods -n kube-system | grep scheduler

# Force recreate to change nodeName on an existing pod
kubectl replace --force -f pod.yaml
```

## Key Rules

| Scenario | Action |
|---|---|
| Set node at creation | Use `nodeName` in pod spec |
| Move an existing pod | `kubectl replace --force -f pod.yaml` |
| Scheduler is down, pod is pending | POST to Binding API |
| Check scheduling events | `kubectl describe pod` → Events |
