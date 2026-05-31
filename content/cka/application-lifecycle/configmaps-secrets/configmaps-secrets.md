# Environment Variables, ConfigMaps & Secrets

## Env Var Injection Sources

```mermaid
flowchart TD
    subgraph SOURCES["Env Var Sources"]
        D["Direct literal\nenv: name/value"]
        CM1["ConfigMap — single key\nvalueFrom.configMapKeyRef"]
        CM2["ConfigMap — all keys\nenvFrom.configMapRef"]
        CM3["ConfigMap — as files\nvolumeMount"]
        S1["Secret — single key\nvalueFrom.secretKeyRef"]
        S2["Secret — all keys\nenvFrom.secretRef"]
        S3["Secret — as files\nvolumeMount (mode 0400)"]
    end
    POD["📦 Container"]
    D & CM1 & CM2 & CM3 & S1 & S2 & S3 --> POD

    style D fill:#0f172a,stroke:#94a3b8,color:#f1f5f9
    style CM1 fill:#062f22,stroke:#10b981,color:#d1fae5
    style CM2 fill:#062f22,stroke:#10b981,color:#d1fae5
    style CM3 fill:#062f22,stroke:#10b981,color:#d1fae5
    style S1 fill:#2d1a09,stroke:#f59e0b,color:#fef3c7
    style S2 fill:#2d1a09,stroke:#f59e0b,color:#fef3c7
    style S3 fill:#3b1111,stroke:#ef4444,color:#fee2e2
    style POD fill:#1e1b4b,stroke:#818cf8,color:#e0e7ff
```

## ConfigMaps

```bash
# Create
kubectl create configmap app-config \
  --from-literal=APP_COLOR=blue \
  --from-literal=APP_MODE=production
kubectl create configmap app-config --from-file=config.properties

# View
kubectl get configmaps
kubectl describe configmap app-config
```

```yaml
# Declarative
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  APP_COLOR: blue
  APP_MODE: production
  DB_HOST: mysql-service
```

```yaml
# Inject ALL keys as env vars
spec:
  containers:
  - name: app
    image: myapp
    envFrom:
    - configMapRef:
        name: app-config
```

```yaml
# Inject single key
    env:
    - name: APP_COLOR
      valueFrom:
        configMapKeyRef:
          name: app-config
          key: APP_COLOR
```

```yaml
# Mount as files (each key = one file)
    volumeMounts:
    - name: config-vol
      mountPath: /etc/config
  volumes:
  - name: config-vol
    configMap:
      name: app-config
# Result: /etc/config/APP_COLOR contains "blue"
```

## Secrets

```bash
# Create
kubectl create secret generic app-secret \
  --from-literal=DB_PASSWORD=mysecretpass \
  --from-literal=API_KEY=abc123xyz

# View (values base64-encoded)
kubectl get secrets
kubectl describe secret app-secret        # values hidden
kubectl get secret app-secret -o yaml     # base64 visible
echo 'bXlzZWNyZXRwYXNz' | base64 -d     # decode
```

```yaml
# Declarative (values must be base64 encoded)
apiVersion: v1
kind: Secret
metadata:
  name: app-secret
type: Opaque
data:
  DB_PASSWORD: bXlzZWNyZXRwYXNz
  API_KEY: YWJjMTIzeHl6
```

```yaml
# Mount as files — most secure approach
    volumeMounts:
    - name: secret-vol
      mountPath: /etc/secrets
      readOnly: true
  volumes:
  - name: secret-vol
    secret:
      secretName: app-secret
      defaultMode: 0400
```

> **Best practice:** Prefer volume mounts over env vars for secrets — they don't appear in `kubectl describe pod` output and can be rotated without restarting the pod.
