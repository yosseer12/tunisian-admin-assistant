const fs = require('fs');
const path = require('path');

const dir = process.argv[2] || 'data/procedures';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
let errors = 0;
const err = (f, m) => { console.log('  ERROR ' + f + ': ' + m); errors++; };

for (const f of files) {
  let d;
  try {
    d = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
  } catch (e) {
    err(f, 'invalid JSON - ' + e.message);
    continue;
  }

  if (d.id + '.json' !== f) err(f, 'id "' + d.id + '" does not match the file name');

  for (const k of ['title_fr', 'title_ar', 'source_url', 'last_verified']) {
    if (!d[k] || String(d[k]).startsWith('TODO') || String(d[k]).startsWith('PASTE')) {
      err(f, 'missing or placeholder: ' + k);
    }
  }
  if (d.last_verified && !/^\d{4}-\d{2}-\d{2}$/.test(d.last_verified)) {
    err(f, 'last_verified must look like 2026-11-01');
  }

  for (const k of ['conditions', 'steps', 'documents']) {
    for (const l of ['fr', 'ar']) {
      if (!d[k] || !Array.isArray(d[k][l]) || d[k][l].length === 0) err(f, k + '.' + l + ' is empty');
    }
  }
  for (const k of ['fees', 'office', 'processing_time']) {
    for (const l of ['fr', 'ar']) {
      if (!d[k] || !d[k][l]) err(f, k + '.' + l + ' is empty');
    }
  }
  if (d.verified !== true) err(f, 'verified is not true');
}

const chunks = files.length * 5 * 2;
if (errors === 0) {
  console.log('OK: ' + files.length + ' files valid, ' + chunks + ' chunks will be created (5 sections x 2 languages per file)');
} else {
  console.log(errors + ' problem(s) found');
  process.exit(1);
}