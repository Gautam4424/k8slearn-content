---
title: "Exam Environment Setup"
cert: ["cka", "ckad", "cks"]
roadmap: exam-tips
subtopic: Exam Environment Setup
difficulty: beginner
order: 1
tags: [cka, exam, setup, alias, autocomplete, vim]
---

# Exam Environment Setup (First 2 Minutes)

Before you attempt any questions in a Kubernetes certification exam (CKA, CKAD, or CKS), spend the first two minutes configuring your shell environment. This will save you significant typing time and prevent syntax errors later on.

---

## 🚀 The Golden Setup Script

Run these commands immediately after logging into your exam terminal:

```bash
# 1. Set the alias (most important)
alias k=kubectl

# 2. Enable kubectl autocompletion for bash and the 'k' alias
source <(kubectl completion bash)
complete -F __start_kubectl k

# 3. Set dry-run shortcuts (saves time generating YAML)
export do='--dry-run=client -o yaml'
export now='--force --grace-period=0'

# 4. Set your preferred editor
export KUBE_EDITOR=vim
```

---

## 🎯 How to Use the Shortcuts

### `do` (Dry Run Output)
Instead of writing YAML from scratch, use `k run ... $do > file.yaml`.
```bash
# Generates the pod YAML and saves it to a file
k run nginx --image=nginx $do > pod.yaml
```

### `now` (Force Delete)
By default, Kubernetes waits 30 seconds gracefully terminating a pod. In the exam, you don't have time to wait.
```bash
# Deletes the pod immediately (0 seconds)
k delete pod nginx $now
```

---

## 📍 Managing Contexts

In the exam, you will work across multiple different clusters. At the start of every question, the exam interface will give you a command to switch to the correct context (e.g., `kubectl config use-context wk8s`). **Always run it.**

```bash
# See all available contexts
kubectl config get-contexts

# Verify which context you are currently in
kubectl config current-context
```
