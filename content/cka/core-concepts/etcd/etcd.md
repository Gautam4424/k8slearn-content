# ETCD for Beginners & in Kubernetes

## What is etcd?

- A **distributed, reliable key-value store** — simple, secure, and fast
- Data is stored as **key → value** pairs (not rows/tables like SQL)
- Used by Kubernetes as its **primary data store** for all cluster state

## Installation

```bash
# Download
curl -L https://github.com/etcd-io/etcd/releases/download/v3.5.0/etcd-v3.5.0-linux-amd64.tar.gz -o etcd.tar.gz
tar xzf etcd.tar.gz
./etcd   # starts etcd on port 2379 by default
```

## Basic etcdctl Commands

```bash
# Set a key
etcdctl put key1 value1

# Get a key
etcdctl get key1

# etcdctl API version (Kubernetes uses v3)
export ETCDCTL_API=3
etcdctl version
```

## What etcd Stores

Every piece of cluster state lives in etcd:
- Nodes
- Pods
- ReplicaSets / Deployments
- ConfigMaps / Secrets
- Roles, RoleBindings
- Service Accounts

Only when data is written to etcd is a change considered **complete**.

## Setup: kubeadm vs Manual

| Setup Type | How etcd runs |
| --- | --- |
| **kubeadm** | etcd runs as a pod: `kube-system/etcd-master` |
| **Manual (hard way)** | etcd runs as a systemd service on the master node |

```bash
# kubeadm: inspect the etcd pod
kubectl get pods -n kube-system | grep etcd

# Query etcd directly (from within the etcd pod)
kubectl exec -it etcd-master -n kube-system -- sh
etcdctl get / --prefix --keys-only

# Kubernetes stores data under: /registry/<resource-type>/<namespace>/<name>
```

## High Availability

In HA setups, **multiple etcd instances** run across master nodes. They must know about each other via `--initial-cluster` flag.

```bash
# Example etcd HA startup flag
--initial-cluster controller-0=https://10.0.0.10:2380,controller-1=https://10.0.0.11:2380
```