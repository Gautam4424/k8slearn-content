const fs   = require('fs')
const path = require('path')

const schema          = JSON.parse(fs.readFileSync('schema.json', 'utf8'))
const ALLOWED_CERTS   = schema.certifications.allowed
const ALLOWED_DIFF    = schema.difficulty.allowed
const ALLOWED_QTYPES  = schema.question_types.allowed
const REQUIRED_FIELDS = schema.sidecar_schema.required_fields
const REQUIRED_Q      = schema.sidecar_schema.question_rules.required_fields

let errors = []

function err(label, msg) {
  errors.push(`  ✗ ${label}: ${msg}`)
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) { walk(full); continue }
    if (!entry.name.endsWith('.json')) continue
    if (entry.name === 'schema.json') continue
    validateFile(full)
  }
}

function validateFile(full) {
  const label = full

  let data
  try {
    data = JSON.parse(fs.readFileSync(full, 'utf8'))
  } catch (e) {
    err(label, `invalid JSON — ${e.message}`)
    return
  }

  // required fields
  for (const f of REQUIRED_FIELDS) {
    if (data[f] === undefined || data[f] === null || data[f] === '') {
      err(label, `missing required field "${f}"`)
    }
  }

  // cert allowed
  if (!ALLOWED_CERTS.includes(data.cert)) {
    err(label, `cert "${data.cert}" not in allowed list: ${ALLOWED_CERTS.join(', ')}`)
  }

  // folder must match cert field
  const parts = full.split(path.sep)
  const contentIdx = parts.indexOf('content')
  if (contentIdx !== -1) {
    const folderCert = parts[contentIdx + 1]
    if (folderCert && folderCert !== data.cert) {
      err(label, `cert field "${data.cert}" does not match folder "${folderCert}"`)
    }
  }

  // difficulty allowed
  if (!ALLOWED_DIFF.includes(data.difficulty)) {
    err(label, `difficulty "${data.difficulty}" must be one of: ${ALLOWED_DIFF.join(', ')}`)
  }

  // content field must point to existing md
  if (data.content) {
    const mdPath = path.join(path.dirname(full), data.content)
    if (!fs.existsSync(mdPath)) {
      err(label, `content file "${data.content}" not found in same folder`)
    }
  }

  // questions array
  if (!Array.isArray(data.questions)) {
    err(label, `"questions" must be an array`)
    return
  }
  if (data.questions.length < 1) {
    err(label, `"questions" must have at least 1 item`)
  }
  if (data.questions.length > 20) {
    err(label, `"questions" must not exceed 20 items`)
  }

  for (const [i, q] of data.questions.entries()) {
    const ql = `${label} → question[${i}]`

    for (const f of REQUIRED_Q) {
      if (q[f] === undefined || q[f] === null || q[f] === '') {
        err(ql, `missing required field "${f}"`)
      }
    }

    if (!ALLOWED_QTYPES.includes(q.type)) {
      err(ql, `type "${q.type}" must be one of: ${ALLOWED_QTYPES.join(', ')}`)
    }

    if (!Array.isArray(q.options) || q.options.length < 2) {
      err(ql, `"options" must be an array with at least 2 items`)
    }

    if (typeof q.answer !== 'number') {
      err(ql, `"answer" must be a number (zero-based index)`)
    } else if (Array.isArray(q.options) && q.answer >= q.options.length) {
      err(ql, `"answer" index ${q.answer} is out of bounds for options array`)
    }
  }
}

walk('content')

if (errors.length > 0) {
  console.error('\nValidation failed:\n')
  errors.forEach(e => console.error(e))
  console.error(`\n${errors.length} error(s) found.\n`)
  process.exit(1)
} else {
  console.log(`\nAll content files valid.\n`)
}
