#!/usr/bin/env node
// Usage:
//   node dev-server.js start <archivePath>   - start dev server in background, output URL to stdout
//   node dev-server.js stop <archivePath>    - stop dev server
//   node dev-server.js status <archivePath>  - check status (JSON to stdout)

const { spawn } = require('child_process');
const net = require('net');
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const [,, command, archivePath] = process.argv;

if (!command || !archivePath) {
  process.stderr.write('Usage: node dev-server.js start|stop|status <archive-path>\n');
  process.exit(1);
}

// Validate archive path is within the expected directory (same pattern as deploy.js)
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

const PID_FILE = path.join(absoluteArchive, '.dev-server.pid');
const URL_FILE = path.join(absoluteArchive, '.dev-server.url');
const LOG_FILE = path.join(absoluteArchive, '.dev-server.log');

function readPid() {
  try {
    return parseInt(fs.readFileSync(PID_FILE, 'utf8').trim(), 10);
  } catch {
    return null;
  }
}

function isPidAlive(pid) {
  if (!pid || isNaN(pid)) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function stopServer() {
  const pid = readPid();
  if (pid && isPidAlive(pid)) {
    try {
      // Negative PID kills the entire process group (pnpm + child Next.js process).
      // Works because spawn({ detached: true }) makes the child the process group leader.
      process.kill(-pid, 'SIGTERM');
      process.stderr.write(`Dev 서버 정지 (PID ${pid})\n`);
    } catch (err) {
      process.stderr.write(`PID ${pid} 정지 실패: ${err.message}\n`);
    }
  }
  for (const f of [PID_FILE, URL_FILE]) {
    try { fs.unlinkSync(f); } catch {}
  }
}

function isPortFree(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', () => resolve(false));
    server.once('listening', () => server.close(() => resolve(true)));
    server.listen(port, '127.0.0.1');
  });
}

async function findFreePort(start = 3000, end = 3010) {
  for (let port = start; port <= end; port++) {
    if (await isPortFree(port)) return port;
  }
  return null;
}

function pollUntilReady(port, pid, timeoutMs = 30000) {
  return new Promise((resolve, reject) => {
    const deadline = Date.now() + timeoutMs;
    function attempt() {
      if (!isPidAlive(pid)) {
        reject(new Error(`Dev 서버 프로세스(PID ${pid})가 즉시 종료되었습니다. 로그를 확인하세요: ${LOG_FILE}`));
        return;
      }
      if (Date.now() > deadline) {
        reject(new Error(`Dev 서버가 ${timeoutMs / 1000}초 내에 응답하지 않았습니다. 로그: ${LOG_FILE}`));
        return;
      }
      const req = http.get(`http://localhost:${port}/`, (res) => {
        res.resume();
        resolve();
      });
      req.setTimeout(1000, () => req.destroy());
      req.on('error', () => setTimeout(attempt, 600));
    }
    // Give the process a moment to start before first poll
    setTimeout(attempt, 1000);
  });
}

async function startServer() {
  // Stop existing server if running (idempotent)
  const existingPid = readPid();
  if (existingPid && isPidAlive(existingPid)) {
    process.stderr.write(`기존 dev 서버 정지 중 (PID ${existingPid})...\n`);
    stopServer();
    await new Promise(r => setTimeout(r, 800));
  }

  const port = await findFreePort();
  if (!port) {
    process.stderr.write('ERROR: 사용 가능한 포트를 찾을 수 없습니다 (3000-3010 모두 사용 중).\n');
    process.exit(1);
  }

  const logFd = fs.openSync(LOG_FILE, 'w');
  const child = spawn('pnpm', ['dev', '--port', String(port)], {
    cwd: absoluteArchive,
    detached: true,
    stdio: ['ignore', logFd, logFd],
  });
  // Detach from parent event loop so this script can exit while child lives on
  child.unref();
  fs.closeSync(logFd);

  fs.writeFileSync(PID_FILE, String(child.pid));
  const url = `http://localhost:${port}`;
  fs.writeFileSync(URL_FILE, url);

  process.stderr.write(`Dev 서버 시작 중 (PID ${child.pid}, port ${port})...\n`);

  try {
    await pollUntilReady(port, child.pid);
    process.stderr.write('Dev 서버 준비 완료\n');
  } catch (err) {
    process.stderr.write(`WARNING: ${err.message}\n`);
    // Output the URL anyway — server may just be warming up
  }

  process.stdout.write(url + '\n');
}

if (command === 'start') {
  startServer().catch(err => {
    process.stderr.write(`ERROR: ${err.message}\n`);
    process.exit(1);
  });
} else if (command === 'stop') {
  stopServer();
} else if (command === 'status') {
  const pid = readPid();
  const running = isPidAlive(pid);
  let url;
  try { url = fs.readFileSync(URL_FILE, 'utf8').trim(); } catch {}
  process.stdout.write(JSON.stringify({
    running,
    ...(pid && { pid }),
    ...(url && { url }),
  }, null, 2) + '\n');
} else {
  process.stderr.write(`알 수 없는 커맨드: ${command}\nUsage: node dev-server.js start|stop|status <archive-path>\n`);
  process.exit(1);
}
