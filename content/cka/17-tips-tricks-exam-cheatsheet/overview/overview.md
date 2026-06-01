---
title: "Overview"
cert: ["cka"]
roadmap: "17-tips-tricks-exam-cheatsheet"
subtopic: "Overview"
difficulty: "beginner"
order: 1
tags: ["cka"]
---

# Overview

---

# CKA Exam Tips & Tricks

## Exam Environment Setup (First 2 minutes)

```bash
# 1. Set alias
alias k=kubectl

# 2. Enable autocompletion
source <(kubectl completion bash)
complete -F __start_kubectl k

# 3. Set dry-run shortcut
export do='--dry-run=client -o yaml'
export now='--force --grace-period=0'

# 4. Set vim as editor
export KUBE_EDITOR=vim

# 5. Check current context
kubectl config get-contexts
kubectl config current-context
```

---

# 1. Testing Network Policies

## Server Pod for Testing

```yaml
# Deploy a simple HTTP server to test connectivity
apiVersion: v1
kind: Pod
metadata:
  name: netpol-server
  labels:
    app: netpol-server
spec:
  containers:
  - name: server
    image: nginx:1.25
    ports:
    - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: netpol-server-svc
spec:
  selector:
    app: netpol-server
  ports:
  - port: 80
    targetPort: 80
```

## Client Pod for Testing

```yaml
# Deploy a client to test connectivity from
apiVersion: v1
kind: Pod
metadata:
  name: netpol-client
  labels:
    app: netpol-client
spec:
  containers:
  - name: client
    image: nicolaka/netshoot   # has curl, nslookup, tcpdump, etc.
    command: ['sleep', '3600']
```

```bash
# Test: can client reach server?
kubectl exec -it netpol-client -- curl http://netpol-server-svc
kubectl exec -it netpol-client -- curl http://netpol-server-svc.default.svc.cluster.local

# Test DNS resolution
kubectl exec -it netpol-client -- nslookup netpol-server-svc

# Test with timeout (quick pass/fail)
kubectl exec -it netpol-client -- curl --max-time 3 http://netpol-server-svc

# Check if NetworkPolicy is applied
kubectl get networkpolicies -A
kubectl describe networkpolicy <name>
```

## Quick Network Debug Pod

```bash
# Temporary debug pod with full networking tools
kubectl run debug \
  --image=nicolaka/netshoot \
  --rm -it \
  --restart=Never \
  -- bash

# Inside: ping, curl, nslookup, netstat, tcpdump, ip, ss, traceroute all available

# Test specific namespace isolation
kubectl run debug -n production \
  --image=nicolaka/netshoot \
  --rm -it \
  --restart=Never \
  -- curl http://db-service.database.svc.cluster.local:5432
```

---

# 2. Imperative Command Patterns (Exam Speed)

## The Golden Template Pattern

```bash
# PATTERN: generate YAML, edit, apply
kubectl run myapp --image=nginx $do > pod.yaml
vim pod.yaml                # edit to add whatever you need
kubectl apply -f pod.yaml

# Faster: pipe directly to kubectl apply
kubectl run myapp --image=nginx $do | kubectl apply -f -
```

## Resource Creation One-Liners

```bash
# Pod
k run nginx --image=nginx:1.25 --port=80
k run nginx --image=nginx --labels=app=web,env=prod
k run nginx --image=nginx --env=COLOR=blue --env=SIZE=large
k run nginx --image=nginx --requests=cpu=100m,memory=128Mi --limits=cpu=500m,memory=256Mi

# Deployment
k create deploy myapp --image=nginx --replicas=3
k scale deploy myapp --replicas=5
k set image deploy/myapp nginx=nginx:1.26

# Service
k expose deploy myapp --port=80 --target-port=8080 --type=NodePort
k expose pod nginx --port=80 --name=nginx-svc

# ConfigMap / Secret
k create cm app-config --from-literal=COLOR=blue --from-literal=SIZE=large
k create secret generic db-secret --from-literal=PASS=secret123

# ServiceAccount
k create sa my-sa

# RBAC
k create role pod-reader --verb=get,list,watch --resource=pods
k create rolebinding pb --role=pod-reader --user=jane --serviceaccount=default:my-sa
k create clusterrole cr --verb=get,list --resource=pods,nodes
k create clusterrolebinding crb --clusterrole=cr --user=jane

# Namespace
k create ns staging

# Check access
k auth can-i get pods --as=jane
k auth can-i '*' '*'   # am I admin?
```

---

# 3. Common Exam Scenarios & Solutions

## Scenario: Fix a broken pod

```bash
# Pod in wrong state
kubectl get pods
kubectl describe pod <name>   # read Events section
kubectl logs <name>           # read app errors

# Edit running pod (limited fields editable)
kubectl edit pod <name>

# Force recreate (for fields that can't be edited)
kubectl get pod <name> -o yaml > pod.yaml
vim pod.yaml                  # fix the issue
kubectl delete pod <name> $now
kubectl apply -f pod.yaml
```

## Scenario: Create a pod that runs as non-root

```bash
kubectl run secure --image=nginx $do > secure.yaml
# Add securityContext to the YAML:
# spec:
#   securityContext:
#     runAsUser: 1000
#     runAsNonRoot: true
kubectl apply -f secure.yaml
```

## Scenario: Upgrade cluster with kubeadm

```bash
# Control plane
apt-get install -y kubeadm=1.30.0-1.1
kubeadm upgrade plan
kubeadm upgrade apply v1.30.0
apt-get install -y kubelet=1.30.0-1.1 kubectl=1.30.0-1.1
systemctl daemon-reload && systemctl restart kubelet

# Worker node
kubectl drain node01 --ignore-daemonsets --force
# ssh to node01
apt-get install -y kubeadm=1.30.0-1.1 && kubeadm upgrade node
apt-get install -y kubelet=1.30.0-1.1 kubectl=1.30.0-1.1
systemctl daemon-reload && systemctl restart kubelet
# back on control plane
kubectl uncordon node01
```

## Scenario: etcd backup

```bash
export ETCDCTL_API=3
etcdctl snapshot save /opt/etcd-backup.db \
  --endpoints=https://127.0.0.1:2379 \
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \
  --cert=/etc/kubernetes/pki/etcd/server.crt \
  --key=/etc/kubernetes/pki/etcd/server.key
etcdctl snapshot status /opt/etcd-backup.db --write-out=table
```

---

# 4. Master Quick-Reference Card

## kubectl Verbs

```javascript
get           list resources
describe      detailed info + events
create        create from flags or file
apply         create or update from file
edit          open live resource in editor
delete        delete resource
patch         partial update
replace       delete + create
expose        create a service for a resource
scale         change replicas
set image     update container image
rollout       manage deployment rollouts
exec          run command in container
logs          get container logs
cp            copy files
port-forward  local port to pod port
auth can-i    check permissions
top           resource usage
cordon        mark node unschedulable
drain         evict pods from node
uncordon      mark node schedulable
```

## API Resource Quick Reference

```javascript
Pod                   v1
Service               v1
ConfigMap             v1
Secret                v1
Namespace             v1
ServiceAccount        v1
PersistentVolume      v1
PersistentVolumeClaim v1
Node                  v1
Event                 v1
Deployment            apps/v1
ReplicaSet            apps/v1
DaemonSet             apps/v1
StatefulSet           apps/v1
Job                   batch/v1
CronJob               batch/v1
Ingress               networking.k8s.io/v1
NetworkPolicy         networking.k8s.io/v1
HPA                   autoscaling/v2
StorageClass          storage.k8s.io/v1
Role                  rbac.authorization.k8s.io/v1
RoleBinding           rbac.authorization.k8s.io/v1
ClusterRole           rbac.authorization.k8s.io/v1
ClusterRoleBinding    rbac.authorization.k8s.io/v1
```



