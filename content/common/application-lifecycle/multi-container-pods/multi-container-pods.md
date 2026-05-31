# Multi-Container Pods

Multiple containers in a pod share the same network namespace (localhost), the same IP, and can share volumes. They are always scheduled together on the same node.

## Design Patterns

```mermaid
flowchart TD
    subgraph SIDECAR["1. Sidecar"]
        A1["Main App\nwrites logs to volume"] -->|shared emptyDir| B1["Log Agent\nships to Elasticsearch"]
    end
    subgraph AMBASSADOR["2. Ambassador"]
        A2["Main App\nconnects to localhost:3306"] --> B2["DB Proxy\nroutes to correct DB\n(dev/staging/prod)"]
    end
    subgraph ADAPTER["3. Adapter"]
        A3["Main App\napp-specific metrics format"] --> B3["Adapter\nconverts to Prometheus format"]
    end
```

| Pattern | Purpose | Example |
|---|---|---|
| **Sidecar** | Extends main container | Log shipper, TLS terminator |
| **Ambassador** | Proxies outbound connections | DB proxy, API gateway |
| **Adapter** | Transforms output format | Metrics converter |

## Sidecar Example

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: web-with-log-sidecar
spec:
  containers:
  - name: web
    image: nginx:1.25
    volumeMounts:
    - name: shared-logs
      mountPath: /var/log/nginx
  - name: log-agent
    image: busybox
    command: ['sh', '-c', 'tail -f /logs/access.log']
    volumeMounts:
    - name: shared-logs
      mountPath: /logs
  volumes:
  - name: shared-logs
    emptyDir: {}    # shared between both containers
```

## Key Facts

- All containers share the **same network** — talk via `localhost`
- Containers share **volumes** explicitly mounted by both
- Each container has its own **filesystem** (not shared by default)
- `kubectl logs <pod> -c <container>` — specify container name for logs
- Both containers must succeed for the pod to be `Running`
