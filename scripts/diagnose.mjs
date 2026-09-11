import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

const root = process.cwd();
const frontend = path.join(root, 'frontend');
const backend = path.join(root, 'backend');
const rows = [];
const check = (label, ok, detail, warn=false) => rows.push({ label, status: ok ? '✅' : warn ? '⚠' : '❌', detail });

check('Node.js', !!process.version, process.version);
check('Frontend source', fs.existsSync(path.join(frontend,'src')), 'frontend/src');
check('Backend source', fs.existsSync(path.join(backend,'server.js')), 'backend/server.js');
check('Dependencies', fs.existsSync(path.join(frontend,'node_modules')) || fs.existsSync(path.join(backend,'node_modules')), 'Existing node_modules detected', true);
check('Environment file', fs.existsSync(path.join(backend,'.env')) || fs.existsSync(path.join(backend,'.env.example')), 'backend/.env or .env.example');
check('Media directory', fs.existsSync(path.join(backend,'uploads')), 'backend/uploads', true);
const mongo = Boolean(process.env.MONGO_URI);
check('MONGO_URI', mongo, mongo ? 'configured' : 'not set — JSON fallback mode', true);

const build = spawnSync('npm', ['run','build'], { cwd: frontend, shell: true, encoding: 'utf8', timeout: 45000 });
check('Frontend compile', build.status === 0, build.status === 0 ? 'vite build passed' : (build.stderr || build.stdout || 'build failed').split('\n').slice(-3).join(' '));

const critical = rows.filter(r => r.status === '❌').length;
const warnings = rows.filter(r => r.status === '⚠').length;
console.log('\nSPANDANA Diagnostic Check\n');
for (const r of rows) console.log(`${r.status} ${r.label.padEnd(22)} ${r.detail}`);
console.log(`\nRESULT: ${warnings} warning(s), ${critical} critical error(s)`);
if (critical) process.exitCode = 1;
