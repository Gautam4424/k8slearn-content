---
title: "Common Exam Scenarios & Solutions"
cert: ["cka", "ckad"]
roadmap: exam-tips
subtopic: Common Exam Scenarios & Solutions
difficulty: advanced
order: 4
tags: [scenarios, troubleshooting, upgrade, kubeadm, etcd-backup, non-root]
---

# Common Exam Scenarios & Solutions

Here are quick templates for the most common tasks you will face in Kubernetes certification exams.

---

## 🔧 Scenario: Fix a Broken Pod

If a question asks you to fix a pod that is failing or misconfigured:

```bash
# 1. Investigate the current state
kubectl get pods
kubectl describe pod <name>   # Read the Events section at the bottom
kubectl logs <name>           # Read application errors

# 2. Try to edit it live
# Note: You can only edit image, activeDeadlineSeconds, tolerations, and initContainers live.
kubectl edit pod <name>

# 3. If live edit fails, force recreate it
# Save the current config to a file
kubectl get pod <name> -o yaml > pod.yaml

# Fix the issue in the YAML file
vim pod.yaml                  

# Delete the broken pod immediately
kubectl delete pod <name> $now

# Recreate the fixed pod
kubectl apply -f pod.yaml
```
*(The `$now` variable is `--force --grace-period=0`, set during environment setup).*

---

## 🔒 Scenario: Create a Pod that Runs as Non-Root

A classic security question is to ensure a container runs as a specific user ID and does not run as root.

```bash
# 1. Generate the base YAML
kubectl run secure --image=nginx $do > secure.yaml

# 2. Add the securityContext block to the Pod spec
vim secure.yaml
```

```yaml
# Add this under 'spec:'
spec:
  securityContext:
    runAsUser: 1000
    runAsNonRoot: true
  containers:
  - name: secure
    image: nginx
```

```bash
# 3. Apply
kubectl apply -f secure.yaml
```

---

## ⬆️ Scenario: Upgrade a Cluster with kubeadm

The CKA exam almost always features a cluster upgrade question. **Read the instructions carefully** regarding which node to upgrade (control plane vs worker) and which version to use.

### Upgrading the Control Plane Node
```bash
# 1. Upgrade kubeadm tool itself
apt-get update
apt-get install -y kubeadm=1.30.0-1.1
apt-mark hold kubeadm

# 2. Plan and apply the upgrade
kubeadm upgrade plan
kubeadm upgrade apply v1.30.0

# 3. Upgrade kubelet and kubectl
apt-get install -y kubelet=1.30.0-1.1 kubectl=1.30.0-1.1
apt-mark hold kubelet kubectl

# 4. Restart the kubelet to pick up changes
systemctl daemon-reload
systemctl restart kubelet
```

### Upgrading a Worker Node
```bash
# 1. On the control plane, drain the worker node to safely evict pods
kubectl drain node01 --ignore-daemonsets --force

# 2. SSH into the worker node
ssh node01

# 3. Upgrade kubeadm on the worker
apt-get update
apt-get install -y kubeadm=1.30.0-1.1
apt-mark hold kubeadm

# 4. Upgrade the local node configuration
kubeadm upgrade node

# 5. Upgrade kubelet and kubectl on the worker
apt-get install -y kubelet=1.30.0-1.1 kubectl=1.30.0-1.1
apt-mark hold kubelet kubectl

# 6. Restart kubelet on the worker
systemctl daemon-reload
systemctl restart kubelet

# 7. Exit the SSH session, back to control plane
exit

# 8. Uncordon the node so it can accept pods again
kubectl uncordon node01
```

---

## 💾 Scenario: etcd Backup and Restore

Another classic CKA question. Always specify the `--endpoints`, `--cacert`, `--cert`, and `--key` flags unless you are running `etcdctl` from inside the etcd container itself.

```bash
export ETCDCTL_API=3

# Take the snapshot
etcdctl snapshot save /opt/etcd-backup.db \
  --endpoints=https://127.0.0.1:2379 \
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \
  --cert=/etc/kubernetes/pki/etcd/server.crt \
  --key=/etc/kubernetes/pki/etcd/server.key

# Verify the snapshot was successful
etcdctl snapshot status /opt/etcd-backup.db --write-out=table
```
