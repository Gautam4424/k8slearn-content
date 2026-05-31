const fs = require('fs');
const path = require('path');

function walk(dir) {
  return fs.readdirSync(dir).flatMap(f => {
    const p = path.join(dir, f);
    return fs.statSync(p).isDirectory() ? walk(p) : [p];
  });
}

const base = path.join(__dirname, '..', 'content');
const mdFiles = walk(base).filter(f => f.endsWith('.md'));

const withDiagrams = mdFiles.filter(f => {
  const c = fs.readFileSync(f, 'utf8');
  const hasDiagramBlock = /```(diagram|ascii|visual-diagram)/.test(c);
  const hasAsciiBlock = /```\s*\n[\s\S]*?[│├└┐┘┌─╔╗╚╝║▼▲→←][\s\S]*?```/.test(c);
  return hasDiagramBlock || hasAsciiBlock;
});

console.log('Files with non-mermaid diagrams:');
withDiagrams.forEach(f => console.log(' -', path.relative(base, f)));
console.log('\nTotal needing conversion:', withDiagrams.length);
console.log('Total md files:', mdFiles.length);
