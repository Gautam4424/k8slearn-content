const fs = require('fs');
const path = require('path');

const files = [
  'content/cka/core-concepts/kube-apiserver/kube-apiserver.md',
  'content/cka/core-concepts/kubelet/kubelet.md',
  'content/cka/scheduling/admission-controllers/admission-controllers.md',
  'content/cka/scheduling/daemonsets/daemonsets.md',
  'content/cka/scheduling/labels-selectors/labels-selectors.md',
  'content/cka/scheduling/multiple-schedulers/multiple-schedulers.md',
  'content/cka/scheduling/scheduling-overview/scheduling-overview.md',
  'content/cka/scheduling/static-pods/static-pods.md',
];

files.forEach(f => {
  const full = path.join(__dirname, '..', f);
  const c = fs.readFileSync(full, 'utf8');
  // extract diagram blocks (not bash/yaml/json)
  const blocks = [];
  const re = /```(\w*)\n([\s\S]*?)```/g;
  let m;
  while ((m = re.exec(c)) !== null) {
    const lang = m[1];
    if (!['bash','yaml','yml','json','sh','ts','js','typescript','javascript','text','mermaid'].includes(lang)) {
      blocks.push({ lang, body: m[2].trim().substring(0, 600) });
    }
  }
  if (blocks.length > 0) {
    console.log('=== ' + f + ' ===');
    blocks.forEach(b => console.log(`lang:"${b.lang}"\n${b.body}\n---`));
  }
});
