# Services

## What is a Service?

A **Service** provides a **stable network endpoint** (IP + DNS name) to access a group of pods. Pods come and go with dynamic IPs — Services abstract that away.

## Service Types

| Type | Access | Use Case |
| --- | --- | --- |
| `ClusterIP` | Internal only (default) | Inter-service communication |
| `NodePort` | External via `<NodeIP>:<NodePort>` | Dev/testing, on-prem |
| `LoadBalancer` | External via cloud LB | Production on cloud |
| `ExternalName` | CNAME to external DNS | Access external service by name |

## NodePort

```yaml
apiVersion: v1
kind: Service
metadata:
  name: myapp-service
spec:
  type: NodePort
  selector:
    app: myapp
  ports:
  - protocol: TCP
    port: 80          # Service port (ClusterIP)
    targetPort: 8080  # Container port on pod
    nodePort: 30008   # External port on node (30000–32767)
```

> NodePort range: **30000–32767**

## ClusterIP

```yaml
apiVersion: v1
kind: Service
metadata:
  name: backend
spec:
  type: ClusterIP   # default
  selector:
    app: backend
  ports:
  - port: 80
    targetPort: 8080
```

## LoadBalancer

```yaml
apiVersion: v1
kind: Service
metadata:
  name: frontend
spec:
  type: LoadBalancer
  selector:
    app: frontend
  ports:
  - port: 80
    targetPort: 8080
```

## Key Commands

```bash
# Create a ClusterIP service for an existing deployment
kubectl expose deployment myapp --port=80 --target-port=8080

# Create a NodePort service
kubectl expose deployment myapp --type=NodePort --port=80

# List services
kubectl get services
kubectl get svc

# Describe
kubectl describe svc myapp-service
```