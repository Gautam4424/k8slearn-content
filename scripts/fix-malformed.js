const fs = require('fs');
const path = require('path');
const BASE = path.join(__dirname, '..');

// ── Fix kubelet.md ────────────────────────────────────────────────────────────
const kubeletPath = path.join(BASE, 'content/cka/core-concepts/kubelet/kubelet.md');
const kubelet = `# kubelet

## Role

The **kubelet is the primary node agent**. It runs on every worker node and is responsible for:

- Registering the node with the API server
- Receiving PodSpec from the API server
- Pulling container images and starting containers via the container runtime
- Monitoring pod/container health and reporting back to the API server

## Important Note

> ⚠️ **kubeadm does NOT deploy kubelet**. You must install kubelet manually on each worker node.

\`\`\`bash
# Install on worker node
apt-get install -y kubelet

# Check status
systemctl status kubelet

# View running process and flags
ps aux | grep kubelet
\`\`\`

## kubelet Startup Flow

\`\`\`mermaid
graph TD
    start["kubelet starts"]
    register["Register node with API Server"]
    ready["API Server marks node as Ready"]
    poll["Poll API for PodSpecs assigned to this node"]
    cri["Start containers via CRI (containerd)"]
    report["Report container status back to API Server"]

    start --> register --> ready --> poll --> cri --> report
    report -->|"Continuous loop"| poll
\`\`\`
`;
fs.writeFileSync(kubeletPath, kubelet, 'utf8');
console.log('✅ Fixed: kubelet.md');

// ── Fix multiple-schedulers.md — extract mermaid from inside yaml block ───────
const schedPath = path.join(BASE, 'content/cka/scheduling/multiple-schedulers/multiple-schedulers.md');
let sched = fs.readFileSync(schedPath, 'utf8');

// The mermaid block got injected after line 36 inside a yaml block
// Pattern: ```yaml...```mermaid...```yaml  =>  we need to:
// 1. Close the yaml block before the mermaid
// 2. Add the mermaid block properly
// 3. Then continue the next yaml block

// Remove the corrupt injection: "```mermaid\n...\n```yaml" pattern
// and replace "Extension Points Pipeline" section's raw block with proper mermaid
sched = sched.replace(
  /```mermaid\n([\s\S]*?)```yaml/,
  '```\n\n## Scheduling Framework Pipeline\n\n```mermaid\ngraph LR\n    QS["QueueSort"]\n    PF["PreFilter"]\n    F["Filter\\n(eliminate unfit nodes)"]\n    POF["PostFilter"]\n    PS["PreScore"]\n    SC["Score\\n(rank remaining nodes)"]\n    R["Reserve"]\n    P["Permit"]\n    PB["PreBind"]\n    B["Bind\\n(write nodeName)"]\n    POB["PostBind"]\n\n    QS --> PF --> F --> POF --> PS --> SC --> R --> P --> PB --> B --> POB\n```\n\n```yaml'
);

// Also replace the plain ``` block in Extension Points Pipeline section
sched = sched.replace(
  /```\nQueueSort.*?\n```/s,
  ''
);

fs.writeFileSync(schedPath, sched, 'utf8');
console.log('✅ Fixed: multiple-schedulers.md');

console.log('\nDone.');
