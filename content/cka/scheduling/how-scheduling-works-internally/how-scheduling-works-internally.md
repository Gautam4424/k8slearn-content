---
title: "How Scheduling Works Internally"
cert: ["cka"]
roadmap: "scheduling"
subtopic: "How Scheduling Works Internally"
difficulty: "intermediate"
order: 2
tags: ["cka", "scheduling"]
---

# How Scheduling Works Internally
Every pod spec has a `nodeName` field — empty by default. The scheduler fills it in. If you fill it yourself, the scheduler skips that pod entirely.
