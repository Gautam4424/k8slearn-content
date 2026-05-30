> **Source:** [KodeKloud CKA Course — 02-Core-Concepts](https://github.com/kodekloudhub/certified-kubernetes-administrator-course/tree/master/docs/02-Core-Concepts) | 📅 Created: May 2026

# Imperative Commands with kubectl

For the CKA exam, **speed matters**. Use imperative commands to generate YAML quickly rather than writing from scratch.

## Core Patterns

```bash
# --dry-run=client -o yaml → generate YAML without creating
kubectl run nginx --image=nginx --dry-run=client -o yaml > pod.yaml
kubectl create deployment myapp --image=nginx --dry-run=client -o yaml > deploy.yaml
```

## Pods

```bash
# Create pod
kubectl run nginx --image=nginx

# Create pod with labels
kubectl run nginx --image=nginx --labels="env=prod,app=nginx"

# Create pod with env variable
kubectl run nginx --image=nginx --env="ENV=production"

# Create pod exposing a port
kubectl run nginx --image=nginx --port=80

# Create pod and expose as service in one command
kubectl run nginx --image=nginx --port=80 --expose
```

## Deployments

```bash
# Create deployment
kubectl create deployment myapp --image=nginx

# With replicas
kubectl create deployment myapp --image=nginx --replicas=3

# Scale
kubectl scale deployment myapp --replicas=5

# Update image
kubectl set image deployment/myapp nginx=nginx:1.26
```

## Services

```bash
# Expose a deployment as ClusterIP
kubectl expose deployment myapp --port=80 --name=myapp-svc

# Expose as NodePort
kubectl expose deployment myapp --type=NodePort --port=80 --name=myapp-svc

# Create ClusterIP service directly
kubectl create service clusterip myapp --tcp=80:8080

# Create NodePort service directly
kubectl create service nodeport myapp --tcp=80:8080 --node-port=30080
```

## ConfigMaps & Secrets

```bash
# ConfigMap from literal
kubectl create configmap app-config --from-literal=APP_COLOR=blue --from-literal=ENV=prod

# ConfigMap from file
kubectl create configmap app-config --from-file=config.properties

# Secret from literal
kubectl create secret generic app-secret --from-literal=DB_PASS=mysecret

# Secret from file
kubectl create secret generic app-secret --from-file=secret.properties
```

## Other Useful Imperative Commands

```bash
# Create namespace
kubectl create namespace dev

# Create ServiceAccount
kubectl create serviceaccount mysa

# Create role
kubectl create role pod-reader --verb=get,list,watch --resource=pods

# Create rolebinding
kubectl create rolebinding pod-reader-binding --role=pod-reader --user=jane

# Apply changes to a live object
kubectl edit deployment myapp

# Replace (delete + recreate)
kubectl replace --force -f pod.yaml
```

## Exam Tips

> 💡 **Always use `--dry-run=client -o yaml` to generate a base YAML**, then edit and apply. This saves huge amounts of time on the CKA exam.

| Shortcut | What it does |
| --- | --- |
| `-o yaml` | Output as YAML |
| `-o json` | Output as JSON |
| `-o wide` | Extra columns (node, IP) |
| `--dry-run=client` | Simulate only, don't actually create |
| `-n <ns>` | Target a specific namespace |
| `-A` | All namespaces |

---

# Quick Reference: Core Concepts Cheat Sheet

## Component Health Checks

```bash
# Check control plane pods (kubeadm)
kubectl get pods -n kube-system

# Check component status
kubectl get componentstatuses

# kubelet status on a node
systemctl status kubelet
journalctl -u kubelet -f

# etcd health
kubectl exec -n kube-system etcd-<master> -- etcdctl \
  --endpoints=https://127.0.0.1:2379 \
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \
  --cert=/etc/kubernetes/pki/etcd/server.crt \
  --key=/etc/kubernetes/pki/etcd/server.key \
  endpoint health
```

## Service DNS Format

```
<service-name>.<namespace>.svc.cluster.local
```

---

📚 **Reference:** [KodeKloud CKA Course](https://kodekloud.com/courses/certified-kubernetes-administrator-cka/) | [Official Kubernetes Docs](https://kubernetes.io/docs/concepts/)