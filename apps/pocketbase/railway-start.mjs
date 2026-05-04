#!/usr/bin/env node
/**
 * Railway/Nixpacks-friendly PocketBase launcher.
 * - Uses PORT env (Railway) with fallback to 8090 for local parity.
 * - Avoids hardcoding 8090 in package.json scripts.
 */
import { spawn } from 'node:child_process';

const port = process.env.PORT || '8090';
const args = [
  'serve',
  `--http=0.0.0.0:${port}`,
  '--dir=./pb_data',
  '--migrationsDir=./pb_migrations',
  '--hooksDir=./pb_hooks',
  '--hooksWatch=false',
];

const child = spawn(process.execPath, ['start.js', ...args], { stdio: 'inherit' });
child.on('exit', (code) => process.exit(code ?? 0));
