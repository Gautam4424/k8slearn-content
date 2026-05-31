# Kubernetes Version Upgrades

Upgrading a production Kubernetes cluster requires following a strict order of operations to ensure high availability and prevent version skew conflicts. Upgrades must be performed **one minor version at a time** (e.g., `v1.27` → `v1.28` → `v1.29`).

## Version Format & Skew Policy

Kubernetes releases follow **Semantic Versioning** (`vMajor.Minor.Patch`).

### Version Skew Policy

* **kube-apiserver**: Reference version `X` (e.g. `v1.30.0`)
* **kube-controller-manager / kube-scheduler**: Allowed to be `X` or `X-1` (must not be newer than the API server)
* **kubelet / kube-proxy**: Allowed to be `X`, `X-1`, or `X-2` (cannot be newer than the API server)
* **kubectl**: Allowed to be `X+1` down to `X-1`

---

## Cluster Upgrade Flow (kubeadm)

The control plane components must always be upgraded **before** upgrading worker nodes.

```mermaid
flowchart TD
    START(["🚀 Begin Upgrade"])

    subgraph CP["Control Plane (Master Node)"]
        CP1["1. Upgrade kubeadm\napt-get install kubeadm=1.30.0-1.1"]
        CP2["2. Plan upgrade\nkubeadm upgrade plan"]
        CP3["3. Apply upgrade\nkubeadm upgrade apply v1.30.0"]
        CP4["4. Upgrade kubelet + kubectl\napt install kubelet=1.30.0 kubectl=1.30.0"]
        CP5["5. Reload & restart kubelet\nsystemctl restart kubelet"]
    end

    subgraph W1["Worker Node (node01)"]
        W1a["1. Drain node\nkubectl drain node01"]
        W1b["2. Upgrade kubeadm\napt-get install kubeadm=1.30.0-1.1"]
        W1c["3. Upgrade config\nkubeadm upgrade node"]
        W1d["4. Upgrade kubelet + kubectl\napt install kubelet=1.30.0 kubectl=1.30.0"]
        W1e["5. Restart kubelet + Uncordon\nkubectl uncordon node01"]
    end

    VERIFY(["✅ Verify Node Versions\nkubectl get nodes"])

    START --> CP1 --> CP2 --> CP3 --> CP4 --> CP5
    CP5 --> W1a --> W1b --> W1c --> W1d --> W1e --> VERIFY

    style START fill:#1e293b,stroke:#94a3b8,color:#f1f5f9
    style CP1 fill:#0f172a,stroke:#3b82f6,color:#dbeafe
    style CP2 fill:#0f172a,stroke:#3b82f6,color:#dbeafe
    style CP3 fill:#0f172a,stroke:#3b82f6,color:#dbeafe
    style CP4 fill:#0f172a,stroke:#3b82f6,color:#dbeafe
    style CP5 fill:#0f172a,stroke:#3b82f6,color:#dbeafe
    style W1a fill:#062f22,stroke:#10b981,color:#d1fae5
    style W1b fill:#062f22,stroke:#10b981,color:#d1fae5
    style W1c fill:#062f22,stroke:#10b981,color:#d1fae5
    style W1d fill:#062f22,stroke:#10b981,color:#d1fae5
    style W1e fill:#062f22,stroke:#10b981,color:#d1fae5
    style VERIFY fill:#1e293b,stroke:#94a3b8,color:#f1f5f9
    style CP fill:#1e1b4b,stroke:#818cf8,color:#e0e7ff
    style W1 fill:#062f2c,stroke:#14b8a6,color:#ccfbf1
```

---

## Master Node Upgrade Step-by-Step

### 1. Upgrade kubeadm

```bash
apt-get update
apt-get install -y --allow-change-held-packages kubeadm=1.30.0-1.1
kubeadm version
```

### 2. Run Upgrade Plan and Apply
The plan command verifies that your cluster is in a healthy state and displays the available upgrade versions.

```bash
# Verify the upgrade path
kubeadm upgrade plan

# Apply the upgrade (this downloads images and upgrades control plane components)
kubeadm upgrade apply v1.30.0
```

### 3. Upgrade Kubelet & Kubectl on Master
Once the control plane components (API server, scheduler, controllers) are upgraded, upgrade the node components on the master.

```bash
apt-get install -y --allow-change-held-packages kubelet=1.30.0-1.1 kubectl=1.30.0-1.1

# Reload and restart services
systemctl daemon-reload
systemctl restart kubelet
```

---

## Worker Node Upgrade Step-by-Step

Perform these worker node steps **one node at a time** to maintain overall cluster capacity.

### 1. Drain the Node
Run this command from the upgraded **Control Plane/Master node** to safely reschedule pods:

```bash
kubectl drain node01 --ignore-daemonsets --force
```

### 2. Upgrade kubeadm on the Worker Node
SSH to the worker node and perform the upgrade:

```bash
ssh node01

# Upgrade kubeadm package
apt-get update
apt-get install -y --allow-change-held-packages kubeadm=1.30.0-1.1
```

### 3. Upgrade Kubelet Configuration
Run the local kubeadm upgrade node command:

```bash
kubeadm upgrade node
```

### 4. Upgrade Kubelet and Kubectl Packages
Upgrade packages and restart the local kubelet service:

```bash
apt-get install -y --allow-change-held-packages kubelet=1.30.0-1.1 kubectl=1.30.0-1.1

systemctl daemon-reload
systemctl restart kubelet
exit
```

### 5. Uncordon the Worker Node
Back on the **Control Plane/Master node**, allow the node to schedule workloads again:

```bash
kubectl uncordon node01

# Verify version shows v1.30.0
kubectl get nodes
```
