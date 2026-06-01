---
title: "Master Quick-Reference Card"
cert: ["cka", "ckad", "cks"]
roadmap: exam-tips
subtopic: Master Quick-Reference Card
difficulty: intermediate
order: 5
tags: [reference, verbs, api-resources, kubectl, cheat-sheet]
---

# Master Quick-Reference Card

Keep these lists mentally accessible. Knowing the exact verb and the API group of resources is crucial for exams, especially when writing RBAC rules (Roles/ClusterRoles) from memory.

---

## 🗣️ Essential kubectl Verbs

| Verb | Action | Example |
| --- | --- | --- |
| `get` | List resources (brief overview) | `kubectl get pods -A` |
| `describe` | Detailed info + event history | `kubectl describe node worker-1` |
| `create` | Create from imperative flags or file | `kubectl create ns dev` |
| `apply` | Create or declarative update from file | `kubectl apply -f app.yaml` |
| `edit` | Open live resource in default editor | `kubectl edit svc frontend` |
| `delete` | Delete a resource | `kubectl delete pod myapp $now` |
| `patch` | Partial update (JSON/Merge patch) | `kubectl patch node node01 -p ...` |
| `replace` | Delete + recreate from file | `kubectl replace --force -f pod.yaml` |
| `expose` | Create a service for a workload | `kubectl expose deploy web --port=80` |
| `scale` | Change number of replicas | `kubectl scale rs web --replicas=3` |
| `set image` | Imperatively update a container image | `kubectl set image deploy/web nginx=nginx:1.26` |
| `rollout` | Manage deployment rollouts/history | `kubectl rollout undo deploy/web` |
| `exec` | Run a command inside a container | `kubectl exec -it pod -- sh` |
| `logs` | Fetch container application logs | `kubectl logs pod-name --previous` |
| `cp` | Copy files to/from a container | `kubectl cp file pod:/tmp/file` |
| `port-forward`| Forward local port to pod/svc | `kubectl port-forward svc/db 5432:5432` |
| `auth can-i` | Verify RBAC permissions | `kubectl auth can-i create pods` |
| `top` | View CPU/Memory metrics (needs Metrics Server) | `kubectl top nodes` |
| `cordon` | Mark node unschedulable (taint) | `kubectl cordon node01` |
| `drain` | Evict all pods from node + cordon | `kubectl drain node01 --ignore-daemonsets` |
| `uncordon` | Remove unschedulable taint | `kubectl uncordon node01` |

---

## 📚 API Resource Quick Reference

When creating Roles or ClusterRoles, you must know which `apiGroup` a resource belongs to. Core resources (like Pods and Services) have an empty API group `""` in RBAC definitions, but objects like Deployments and NetworkPolicies belong to specific groups.

| Resource | API Group | Short name |
| --- | --- | --- |
| **Pod** | `v1` (Core) | `po` |
| **Service** | `v1` (Core) | `svc` |
| **ConfigMap** | `v1` (Core) | `cm` |
| **Secret** | `v1` (Core) | `secret` |
| **Namespace** | `v1` (Core) | `ns` |
| **ServiceAccount** | `v1` (Core) | `sa` |
| **PersistentVolume** | `v1` (Core) | `pv` |
| **PersistentVolumeClaim** | `v1` (Core) | `pvc` |
| **Node** | `v1` (Core) | `no` |
| **Event** | `v1` (Core) | `ev` |
| **Deployment** | `apps/v1` | `deploy` |
| **ReplicaSet** | `apps/v1` | `rs` |
| **DaemonSet** | `apps/v1` | `ds` |
| **StatefulSet** | `apps/v1` | `sts` |
| **Job** | `batch/v1` | `job` |
| **CronJob** | `batch/v1` | `cj` |
| **Ingress** | `networking.k8s.io/v1` | `ing` |
| **NetworkPolicy** | `networking.k8s.io/v1` | `netpol` |
| **HorizontalPodAutoscaler** | `autoscaling/v2` | `hpa` |
| **StorageClass** | `storage.k8s.io/v1` | `sc` |
| **Role** | `rbac.authorization.k8s.io/v1` | `role` |
| **RoleBinding** | `rbac.authorization.k8s.io/v1` | `rb` |
| **ClusterRole** | `rbac.authorization.k8s.io/v1` | `cr` |
| **ClusterRoleBinding**| `rbac.authorization.k8s.io/v1` | `crb` |

*Tip: If you ever forget an API group during the exam, just run `kubectl api-resources`. It lists all resources, their short names, API groups, and whether they are namespaced.*
