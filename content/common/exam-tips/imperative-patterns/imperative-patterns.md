---
title: "Imperative Command Patterns"
cert: ["cka", "ckad", "cks"]
roadmap: exam-tips
subtopic: Imperative Command Patterns
difficulty: intermediate
order: 3
tags: [imperative, dry-run, create, expose, run, kubectl]
---

# Imperative Command Patterns (Exam Speed)

In the exam, writing YAML from scratch is a massive time sink. Always use imperative commands to either create the resource directly or generate the base YAML structure that you can then edit.

---

## 🥇 The Golden Template Pattern

If a question asks you to create a resource with specific configurations that aren't supported by imperative flags (e.g., adding a `volumeMount` or a `securityContext`), use this pattern:

```bash
# 1. Generate the base YAML
kubectl run myapp --image=nginx $do > pod.yaml

# 2. Edit the YAML to add your specific requirements
vim pod.yaml

# 3. Apply the YAML
kubectl apply -f pod.yaml
```

*Note: The `$do` variable was set during [Environment Setup](./environment-setup.md) as `export do='--dry-run=client -o yaml'`.*

If you are comfortable with `vim`, you can even pipe directly to `kubectl apply` without saving a file (though saving to a file is safer if you make a mistake):
```bash
kubectl run myapp --image=nginx $do | kubectl apply -f -
```

---

## ⚡ Resource Creation One-Liners

Memorise these commands to instantly generate the most common exam resources.

### 📦 Pods
```bash
k run nginx --image=nginx:1.25 --port=80
k run nginx --image=nginx --labels=app=web,env=prod
k run nginx --image=nginx --env=COLOR=blue --env=SIZE=large
k run nginx --image=nginx --requests=cpu=100m,memory=128Mi --limits=cpu=500m,memory=256Mi
```

### 🚀 Deployments
```bash
k create deploy myapp --image=nginx --replicas=3
k scale deploy myapp --replicas=5
k set image deploy/myapp nginx=nginx:1.26
```

### 🔌 Services
*Note: `expose` creates a Service that matches the labels and ports of the target resource.*
```bash
k expose deploy myapp --port=80 --target-port=8080 --type=NodePort
k expose pod nginx --port=80 --name=nginx-svc
```

### 🗄️ ConfigMaps & Secrets
```bash
k create cm app-config --from-literal=COLOR=blue --from-literal=SIZE=large
k create secret generic db-secret --from-literal=PASS=secret123
```

### 🔐 RBAC & ServiceAccounts
```bash
# ServiceAccount
k create sa my-sa

# Roles & RoleBindings (Namespaced)
k create role pod-reader --verb=get,list,watch --resource=pods
k create rolebinding pb --role=pod-reader --user=jane --serviceaccount=default:my-sa

# ClusterRoles & ClusterRoleBindings (Cluster-wide)
k create clusterrole cr --verb=get,list --resource=pods,nodes
k create clusterrolebinding crb --clusterrole=cr --user=jane
```

### 📂 Namespaces
```bash
k create ns staging
```

---

## 🛡️ Checking Permissions

If a question asks you to verify if a user or ServiceAccount has specific access:

```bash
# Check access as a specific user
k auth can-i get pods --as=jane

# Check if you have full admin privileges
k auth can-i '*' '*'
```
