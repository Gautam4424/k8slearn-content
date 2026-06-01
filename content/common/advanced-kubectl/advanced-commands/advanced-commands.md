---
title: "Advanced kubectl Commands"
cert: ["cka", "ckad", "cks"]
roadmap: advanced-kubectl
subtopic: Advanced kubectl Commands
difficulty: advanced
order: 2
tags: [kubectl, imperative, dry-run, port-forward, exam-tips, commands]
---

# Advanced kubectl Commands

Mastering `kubectl` is essential for speed in exams and efficiency in daily operations. Using imperative commands with `--dry-run=client -o yaml` is the fastest way to generate base manifests without writing YAML from scratch.

---

## ⚡ Imperative Object Management (Dry Run)

```bash
# Generate YAML without creating (dry-run trick)
kubectl run nginx --image=nginx --dry-run=client -o yaml > pod.yaml
kubectl create deployment myapp --image=nginx --replicas=3 --dry-run=client -o yaml
kubectl expose deployment myapp --port=80 --type=NodePort --dry-run=client -o yaml

# ConfigMaps and Secrets
kubectl create configmap my-cm --from-literal=key=value --dry-run=client -o yaml
kubectl create secret generic my-sec --from-literal=pass=secret --dry-run=client -o yaml

# RBAC
kubectl create serviceaccount my-sa --dry-run=client -o yaml
kubectl create role my-role --verb=get,list --resource=pods --dry-run=client -o yaml
kubectl create rolebinding my-rb --role=my-role --user=jane --dry-run=client -o yaml

# Force replace (delete + create in one step)
kubectl replace --force -f pod.yaml

# Patch a field in-place (JSON format)
kubectl patch pod nginx -p '{"spec":{"containers":[{"name":"nginx","image":"nginx:1.26"}]}}'
kubectl patch deployment myapp --type=json \
  -p='[{"op":"replace","path":"/spec/replicas","value":5}]'
```

---

## 📋 Output Formats

```bash
-o yaml             # full YAML (ideal for exporting resources)
-o json             # full JSON (ideal for programmatic parsing)
-o wide             # extra columns (e.g. shows Node and IP for pods)
-o name             # just the resource type and name (e.g. pod/nginx)
-o jsonpath=        # JSONPath query extraction
-o custom-columns=  # Pick your own columns
--sort-by=          # Sort output based on a JSON path
```

---

## 🛠️ Useful kubectl Shortcuts

```bash
# Resource Type Abbreviations
kubectl get po          # pods
kubectl get svc         # services
kubectl get deploy      # deployments
kubectl get rs          # replicasets
kubectl get cm          # configmaps
kubectl get ns          # namespaces
kubectl get pv          # persistentvolumes
kubectl get pvc         # persistentvolumeclaims
kubectl get sa          # serviceaccounts
kubectl get ing         # ingresses
kubectl get netpol      # networkpolicies
kubectl get sc          # storageclasses

# General operations
kubectl get all -A                           # All resources in all namespaces
kubectl get pods -w                          # Watch live (like 'top')
kubectl config set-context --current --namespace=production  # Set default namespace

# Debugging and Execution
kubectl exec -it <pod> -- /bin/bash          # Exec into a pod
kubectl exec -it <pod> -c <container> -- sh  # Exec into specific container

# File transfer
kubectl cp <pod>:/path/to/file ./local-file  # Copy from pod
kubectl cp ./local-file <pod>:/path/to/file  # Copy to pod

# Port forwarding (local:remote)
kubectl port-forward pod/nginx 8080:80
kubectl port-forward svc/myapp 8080:80
kubectl port-forward deployment/myapp 8080:80

# Temporary debug pods
kubectl run debug --image=busybox --rm -it -- /bin/sh
kubectl run debug --image=nicolaka/netshoot --rm -it -- bash

# Bulk Application
kubectl apply -f ./manifests/                # Apply all in directory
kubectl apply -R -f ./manifests/             # Apply recursively
kubectl delete all --all -n dev              # Delete everything in a namespace
```

---

## 🏎️ CKA / CKAD Exam Speed Tips

```bash
# 1. Set aliases (saves significant typing time in exam)
alias k=kubectl
export do="--dry-run=client -o yaml"         # usage: k run nginx --image=nginx $do
export now="--force --grace-period=0"        # usage: k delete pod nginx $now

# 2. Enable kubectl auto-completion
source <(kubectl completion bash)
echo 'source <(kubectl completion bash)' >> ~/.bashrc
complete -o default -F __start_kubectl k     # makes 'k' auto-complete work

# 3. Use vim as the default editor
export KUBE_EDITOR=vim

# 4. Quick namespace switch
kubectl config set-context --current --namespace=kube-system
```
