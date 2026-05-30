# Resource Limits

## Requests vs Limits

| | Requests | Limits |
|---|---|---|
| Purpose | Minimum guaranteed resources | Maximum allowed |
| Used by scheduler | Yes — must fit on node | No |
| CPU exceeded | Throttled | Throttled |
| Memory exceeded | — | OOMKilled (pod restarted) |

## CPU Units

- `1` = 1 vCPU (1 AWS vCPU / 1 GCP Core / 1 Azure Core / 1 Hyperthread)
- `500m` = 0.5 CPU
- `100m` = 0.1 CPU
- `1m` = minimum unit

## QoS Classes

| QoS Class | Condition | Eviction Priority |
|---|---|---|
| `Guaranteed` | requests == limits for ALL containers | Last evicted |
| `Burstable` | requests set, but limits differ OR only some containers set them | Middle |
| `BestEffort` | No requests OR limits at all | First evicted |

## Example 1 — Guaranteed QoS (Production)

```yaml
spec:
  containers:
  - name: api
    image: payment-api:v3
    resources:
      requests:
        memory: "512Mi"
        cpu: "500m"
      limits:
        memory: "512Mi"    # identical to request = Guaranteed QoS
        cpu: "500m"
```

## Example 2 — Burstable (Typical Web App)

```yaml
spec:
  containers:
  - name: web
    image: nginx:1.25
    resources:
      requests:
        memory: "64Mi"
        cpu: "100m"
      limits:
        memory: "256Mi"    # can burst to 4x the request
        cpu: "500m"
```

## Example 3 — LimitRange (Namespace Defaults and Bounds)

```yaml
apiVersion: v1
kind: LimitRange
metadata:
  name: default-limits
  namespace: dev
spec:
  limits:
  - type: Container
    default:           # applied as limit if container doesn't set one
      cpu: "500m"
      memory: "256Mi"
    defaultRequest:    # applied as request if not set
      cpu: "100m"
      memory: "128Mi"
    max:               # hard cap — exceeding this rejects the pod
      cpu: "2"
      memory: "1Gi"
    min:               # floor — going below this rejects the pod
      cpu: "50m"
      memory: "64Mi"
```

## Example 4 — ResourceQuota (Namespace Total Cap)

```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: production-quota
  namespace: production
spec:
  hard:
    pods: "50"
    requests.cpu: "20"
    requests.memory: 40Gi
    limits.cpu: "40"
    limits.memory: 80Gi
    count/deployments.apps: "20"
    persistentvolumeclaims: "30"
```

```bash
kubectl describe resourcequota production-quota -n production
# Resource           Used   Hard
# --------           ----   ----
# limits.cpu         8      40
# limits.memory      16Gi   80Gi
# pods               12     50
```

## LimitRange vs ResourceQuota

| | LimitRange | ResourceQuota |
|---|---|---|
| Scope | Per container / pod | Per namespace total |
| Purpose | Inject defaults, set per-resource bounds | Cap total consumption |
| Controls | min/max/default per resource | Sum of all requests/limits in namespace |
