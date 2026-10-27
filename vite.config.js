import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const packageJson = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));

function getInvitationBuildVersion() {
  const commit = process.env.CF_PAGES_COMMIT_SHA || process.env.CF_COMMIT_SHA || process.env.GITHUB_SHA;
  if (commit) return `${packageJson.version}+${commit.slice(0, 7)}`;

  try {
    const gitCommit = execFileSync('git', ['rev-parse', '--short=7', 'HEAD'], { encoding: 'utf8' }).trim();
    return `${packageJson.version}+${gitCommit}`;
  } catch {
    return `${packageJson.version}+${new Date().toISOString().replace(/\D/g, '').slice(0, 12)}`;
  }
}

export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_INVITATION_VERSION': JSON.stringify(getInvitationBuildVersion()),
  },
  server: {
    host: true,
    allowedHosts: true,
    strictPort: false,
  },
  test: {
    environment: 'jsdom',
    setupFiles: './tests/setup.js',
  },
});