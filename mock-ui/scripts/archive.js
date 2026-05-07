#!/usr/bin/env node
// Usage:
//   node archive.js list              - list all mocks (newest first, JSON)
//   node archive.js metadata <slug>   - show metadata for a specific mock (JSON)

const fs = require('fs');
const path = require('path');
const os = require('os');

const ARCHIVE_DIR = path.join(os.homedir(), '.mock-ui-archive');
const [,, command, arg] = process.argv;

function readMetadata(slug) {
  const metaPath = path.join(ARCHIVE_DIR, slug, '.mock-ui.json');
  const archivePath = path.join(ARCHIVE_DIR, slug);
  const base = { slug, archivePath };
  if (!fs.existsSync(metaPath)) return base;
  try {
    return { ...base, ...JSON.parse(fs.readFileSync(metaPath, 'utf8')) };
  } catch {
    return base;
  }
}

if (command === 'list') {
  if (!fs.existsSync(ARCHIVE_DIR)) {
    process.stdout.write('[]\n');
    process.exit(0);
  }

  const mocks = fs.readdirSync(ARCHIVE_DIR)
    .filter(name => {
      try { return fs.statSync(path.join(ARCHIVE_DIR, name)).isDirectory(); }
      catch { return false; }
    })
    .sort()
    .reverse() // newest first (date-prefixed slugs)
    .map(readMetadata);

  process.stdout.write(JSON.stringify(mocks, null, 2) + '\n');

} else if (command === 'metadata') {
  if (!arg) {
    process.stderr.write('Usage: node archive.js metadata <slug>\n');
    process.exit(1);
  }

  const mockDir = path.join(ARCHIVE_DIR, arg);
  if (!fs.existsSync(mockDir)) {
    process.stderr.write(`Mock '${arg}' not found in ${ARCHIVE_DIR}\n`);
    process.exit(1);
  }

  process.stdout.write(JSON.stringify(readMetadata(arg), null, 2) + '\n');

} else {
  process.stderr.write('Usage: node archive.js list | metadata <slug>\n');
  process.exit(1);
}
