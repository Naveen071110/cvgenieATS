import fs from 'fs';
import path from 'path';

function walk(dir: string, ext = ['.ts', '.tsx', '.js', '.jsx']): string[] {
  let results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist') {
        results = results.concat(walk(full, ext));
      }
    } else if (ext.some(e => file.endsWith(e))) {
      results.push(full);
    }
  });
  return results;
}

// 1. Express Routes Inventory
const serverFiles = walk('server');
const routes: Array<{ method: string; path: string; file: string; line: number; auth: string }> = [];

serverFiles.forEach(filePath => {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    const match = line.match(/(?:app|router)\.(get|post|put|delete|patch)\s*\(\s*['"`]([^'"`]+)['"`]/);
    if (match) {
      const hasRequireAuth = line.includes('requireAuth()') || lines.slice(Math.max(0, idx - 2), idx + 10).some(l => l.includes('requireAuth') || l.includes('getAuth') || l.includes('req.auth'));
      routes.push({
        method: match[1].toUpperCase(),
        path: match[2],
        file: filePath.replace(/\\/g, '/'),
        line: idx + 1,
        auth: hasRequireAuth ? 'Auth Checked / Protected' : 'Public / Unauthenticated',
      });
    }
  });
});

// 2. Client Routes Inventory
const appContent = fs.readFileSync('client/src/App.tsx', 'utf8');
const clientRoutes: Array<{ path: string; protected: boolean; component: string }> = [];
const appLines = appContent.split('\n');
appLines.forEach((l, i) => {
  const rMatch = l.match(/<Route\s+path=["']([^"']+)["']/);
  if (rMatch) {
    const slice = appLines.slice(i, i + 8).join(' ');
    const isProt = slice.includes('<ProtectedRoute>');
    const cMatch = slice.match(/<([A-Z][a-zA-Z0-9]+)/);
    clientRoutes.push({
      path: rMatch[1],
      protected: isProt,
      component: cMatch ? cMatch[1] : 'Unknown',
    });
  } else if (l.includes('<Route>')) {
    clientRoutes.push({
      path: '* (Catch-All / 404)',
      protected: false,
      component: 'NotFound',
    });
  }
});

// 3. Database Schema Inventory
const schemaContent = fs.readFileSync('shared/schema.ts', 'utf8');
const tables: Array<{ name: string; columns: string[] }> = [];
const schemaLines = schemaContent.split('\n');
schemaLines.forEach((line, idx) => {
  const tMatch = line.match(/export const (\w+) = pgTable\(["']([^"']+)["']/);
  if (tMatch) {
    tables.push({
      name: tMatch[2],
      columns: [],
    });
  }
});

// 4. Environment Variables Referenced
const allFiles = walk('.');
const processEnvVars = new Set<string>();
const importMetaVars = new Set<string>();

allFiles.forEach(f => {
  const c = fs.readFileSync(f, 'utf8');
  const peMatches = c.matchAll(/process\.env\.([A-Za-z0-9_]+)/g);
  for (const pm of peMatches) {
    processEnvVars.add(pm[1]);
  }
  const imMatches = c.matchAll(/import\.meta\.env\.([A-Za-z0-9_]+)/g);
  for (const im of imMatches) {
    importMetaVars.add(im[1]);
  }
});

console.log(JSON.stringify({
  routes,
  clientRoutes,
  tables,
  processEnvVars: Array.from(processEnvVars),
  importMetaVars: Array.from(importMetaVars),
}, null, 2));
