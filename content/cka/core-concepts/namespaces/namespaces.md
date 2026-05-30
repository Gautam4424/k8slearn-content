# Namespaces

## What is a Namespace?

Namespaces provide **logical isolation** within a cluster. Think of them as separate environments.

## Default Namespaces

| Namespace | Purpose |
| --- | --- |
| `default` | Where your resources go if no namespace is specified |
| `kube-system` | Kubernetes internal components (apiserver, etcd, scheduler pods) |
| `kube-public` | Publicly accessible data (cluster info) |
| `kube-node-lease` | Node heartbeat lease objects |

## DNS Across Namespaces

Pods in the same namespace reach each other by service name:
```
mysql.connect("db-service")
```

Pods in different namespaces must use the full DNS name:
```
mysql.connect("db-service.dev.svc.cluster.local")
```
Format: `<service>.<namespace>.svc.cluster.local`

## Resource Quotas

```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: compute-quota
  namespace: dev
spec:
  hard:
    pods: "10"
    requests.cpu: "4"
    requests.memory: 5Gi
    limits.cpu: "10"
    limits.memory: 10Gi
```

## Key Commands

```bash
# Create namespace
kubectl create namespace dev

# List resources in a namespace
kubectl get pods -n dev

# List resources in all namespaces
kubectl get pods --all-namespaces
kubectl get pods -A

# Set default namespace for current context
kubectl config set-context --current --namespace=dev

# Generate namespace YAML
kubectl create namespace dev --dry-run=client -o yaml
```