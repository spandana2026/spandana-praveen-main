import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// Always run Playwright from the filesystem's real project path.
// This prevents Windows path-casing differences (e.g. Users\\HI vs users\\hi)
// from making Playwright load the test runner/config from different path strings.
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = fs.realpathSync(path.resolve(scriptDir, '..'));
process.chdir(projectRoot);

const playwrightCli = path.join(projectRoot, 'node_modules', 'playwright', 'cli.js');
const configFile = path.join(projectRoot, 'playwright.navigation.config.ts');

if (!fs.existsSync(playwrightCli)) {
  console.error('Playwright is not installed in the project root. Run: npm install -D @playwright/test');
  process.exit(1);
}

if (!fs.existsSync(configFile)) {
  console.error(`Navigation Playwright config not found: ${configFile}`);
  process.exit(1);
}

const result = spawnSync(process.execPath, [playwrightCli, 'test', '--config', configFile, ...process.argv.slice(2)], {
  cwd: projectRoot,
  stdio: 'inherit',
  env: process.env,
});

if (result.error) {
  console.error(result.error);
  process.exit(1);
}

process.exit(result.status ?? 1);
