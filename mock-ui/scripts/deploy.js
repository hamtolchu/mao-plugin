#!/usr/bin/env node
// Usage: node deploy.js <archive-path>
// Requires: VERCEL_TOKEN env var, vercel CLI installed globally

const { execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

const archivePath = process.argv[2];

if (!archivePath) {
  process.stderr.write('Usage: node deploy.js <archive-path>\n');
  process.exit(1);
}

const token = process.env.VERCEL_TOKEN;
if (!token) {
  process.stderr.write(
    'ERROR: VERCEL_TOKEN 환경변수가 설정되지 않았습니다.\n' +
    'README.md의 "Vercel 토큰 설정" 섹션을 참고하세요.\n'
  );
  process.exit(1);
}

// Validate archive path is within the expected directory
const absoluteArchive = path.resolve(archivePath);
const expectedRoot = path.join(os.homedir(), '.mock-ui-archive');
if (!absoluteArchive.startsWith(expectedRoot + path.sep) && absoluteArchive !== expectedRoot) {
  process.stderr.write(`ERROR: 아카이브 경로가 허용 범위 밖입니다: ${absoluteArchive}\n`);
  process.exit(1);
}

if (!fs.existsSync(absoluteArchive)) {
  process.stderr.write(`ERROR: 아카이브 경로를 찾을 수 없습니다: ${absoluteArchive}\n`);
  process.exit(1);
}

// Verify vercel CLI is installed
try {
  execFileSync('vercel', ['--version'], { stdio: 'pipe' });
} catch {
  process.stderr.write(
    'ERROR: vercel CLI가 설치되어 있지 않습니다.\n' +
    '  npm install -g vercel\n' +
    '을 실행해 설치하세요.\n'
  );
  process.exit(1);
}

const slug = path.basename(absoluteArchive);
process.stderr.write(`Deploying ${slug} to Vercel...\n`);

let output;
try {
  // execFileSync uses argument array — no shell injection risk
  output = execFileSync(
    'vercel',
    ['deploy', '--prod', `--token=${token}`, '--yes'],
    {
      cwd: absoluteArchive,
      env: { ...process.env, VERCEL_TOKEN: token },
      timeout: 180000, // 3 min
    }
  ).toString();
} catch (err) {
  process.stderr.write('Vercel 배포 실패:\n');
  process.stderr.write(err.stdout?.toString() || '');
  process.stderr.write(err.stderr?.toString() || err.message);
  process.exit(1);
}

// Extract the production URL (last https:// line from output)
const httpsLines = output.split('\n')
  .map(l => l.trim())
  .filter(l => l.startsWith('https://'));
const url = httpsLines[httpsLines.length - 1];

if (!url) {
  process.stderr.write('배포는 완료됐지만 URL을 파싱할 수 없습니다. Vercel 출력:\n');
  process.stderr.write(output);
  process.exit(1);
}

// Save metadata
const metadata = {
  slug,
  url,
  archivePath: absoluteArchive,
  deployedAt: new Date().toISOString(),
};
fs.writeFileSync(
  path.join(absoluteArchive, '.mock-ui.json'),
  JSON.stringify(metadata, null, 2)
);

process.stderr.write(`배포 완료: ${url}\n`);
process.stdout.write(url + '\n'); // URL to stdout for agent capture
