const fs = require('fs');
const path = require('path');

const BASE = path.join(__dirname, '..');

// ── Mermaid replacements keyed by relative file path ──────────────────────────
const CONVERSIONS = {

  // 1. kube-apiserver flow
  'content/cka/core-concepts/kube-apiserver/kube-apiserver.md': {
    oldLang: '',
    mermaid: `graph LR
    kubectl["🖥️ kubectl / REST client"]
    api["🔵 kube-apiserver"]
    etcd["🟢 etcd"]
    sched["🟡 kube-scheduler"]
    kubelet["🟠 kubelet"]

    kubectl -->|"kubectl apply -f pod.yaml"| api
    api -->|"Authenticate → Validate"| api
    api -->|"Store state"| etcd
    sched -->|"Watches API for unscheduled pods"| api
    sched -->|"Assigns node → writes nodeName"| api
    kubelet -->|"Watches API for pod specs"| api
    kubelet -->|"Pulls image → starts container"| kubelet
    kubelet -->|"Reports status"| api`,
  },

  // 2. kubelet startup flow
  'content/cka/core-concepts/kubelet/kubelet.md': {
    oldLang: '',
    mermaid: `graph TD
    start["kubelet starts"]
    register["Register node with API Server"]
    ready["API Server marks node as Ready"]
    poll["Poll API for PodSpecs assigned to this node"]
    cri["Start containers via CRI (containerd)"]
    report["Report container status back to API Server"]

    start --> register --> ready --> poll --> cri --> report
    report -->|"Continuous loop"| poll`,
  },

  // 3. admission controllers pipeline
  'content/cka/scheduling/admission-controllers/admission-controllers.md': {
    oldLang: '',
    mermaid: `graph TD
    req["📥 kubectl apply -f pod.yaml"]
    auth1["① AUTHENTICATE\\nWho are you?\\n(cert / token / OIDC)"]
    auth2["② AUTHORIZE\\nAre you allowed?\\n(RBAC)"]
    mutate["③a MUTATING ADMISSION\\nRuns FIRST — can MODIFY the object\\n• DefaultStorageClass\\n• LimitRanger\\n• ServiceAccount\\n• MutatingWebhook"]
    schema["③b SCHEMA VALIDATION\\nIs the YAML valid?"]
    validate["③c VALIDATING ADMISSION\\nALLOW or DENY (read-only)\\n• NamespaceLifecycle\\n• PodSecurity\\n• ValidatingWebhook"]
    etcd["✅ Stored in etcd"]
    deny["❌ Request Rejected"]

    req --> auth1 --> auth2 --> mutate --> schema --> validate
    validate -->|"Allowed"| etcd
    validate -->|"Denied"| deny`,
  },

  // 4. multiple schedulers — scheduling framework pipeline
  'content/cka/scheduling/multiple-schedulers/multiple-schedulers.md': {
    oldLang: '',
    mermaid: `graph LR
    QS["QueueSort"]
    PF["PreFilter"]
    F["Filter\\n(eliminate unfit nodes)"]
    POF["PostFilter"]
    PS["PreScore"]
    SC["Score\\n(rank remaining nodes)"]
    R["Reserve"]
    P["Permit"]
    PB["PreBind"]
    B["Bind\\n(write nodeName)"]
    POB["PostBind"]

    QS --> PF --> F --> POF --> PS --> SC --> R --> P --> PB --> B --> POB`,
  },

  // 5. scheduling overview
  'content/cka/scheduling/scheduling-overview/scheduling-overview.md': {
    oldLang: '',
    mermaid: `graph TD
    A["📦 Pod created\\n(no nodeName set)"]
    B["kube-scheduler watches API Server"]
    C["Phase 1: Filter\\nEliminate unfit nodes"]
    D["Phase 2: Score\\nRank remaining nodes"]
    E["Bind\\nWrite nodeName to pod spec via API"]
    F["kubelet on selected node\\nstarts the pod"]

    A --> B --> C --> D --> E --> F`,
  },

  // 6. static pods
  'content/cka/scheduling/static-pods/static-pods.md': {
    oldLang: '',
    mermaid: `graph TD
    dir["📁 kubelet watches\\n/etc/kubernetes/manifests/"]
    add["File ADDED"]
    edit["File EDITED"]
    del["File DELETED"]
    create["✅ Pod CREATED immediately"]
    recreate["♻️ Pod RECREATED\\n(old deleted → new started)"]
    destroy["❌ Pod DESTROYED"]

    dir --> add --> create
    dir --> edit --> recreate
    dir --> del --> destroy`,
  },
};

// DaemonSets and labels-selectors have no raw diagram blocks — skip
// (their diagrams were already in diagram/ascii lang and listed only via the scanner)
// Let's double check them:
const CHECK_ONLY = [
  'content/cka/scheduling/daemonsets/daemonsets.md',
  'content/cka/scheduling/labels-selectors/labels-selectors.md',
];

CHECK_ONLY.forEach(f => {
  const full = path.join(BASE, f);
  const c = fs.readFileSync(full, 'utf8');
  const re = /```(\w*)\n([\s\S]*?)```/g;
  let m;
  while ((m = re.exec(c)) !== null) {
    const lang = m[1];
    if (!['bash','yaml','yml','json','sh','ts','js','typescript','javascript','text','mermaid'].includes(lang)) {
      console.log(`FOUND in ${f}: lang="${lang}"`);
      console.log(m[2].substring(0, 300));
    }
  }
});

// ── Apply all conversions ─────────────────────────────────────────────────────
let converted = 0;
for (const [rel, { oldLang, mermaid }] of Object.entries(CONVERSIONS)) {
  const full = path.join(BASE, rel);
  if (!fs.existsSync(full)) { console.warn('MISSING:', full); continue; }

  let content = fs.readFileSync(full, 'utf8');

  // Build the regex to match the block with the given language tag (empty or specific)
  // We use a non-greedy match between the fence markers
  const escapedLang = oldLang.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp('```' + escapedLang + '\\n([\\s\\S]*?)```');
  const match = content.match(pattern);

  if (!match) {
    console.warn(`No matching block found in ${rel} (lang="${oldLang}")`);
    continue;
  }

  const replacement = '```mermaid\n' + mermaid + '\n```';
  content = content.replace(pattern, replacement);
  fs.writeFileSync(full, content, 'utf8');
  console.log(`✅ Converted: ${rel}`);
  converted++;
}

console.log(`\nDone — converted ${converted} files.`);
