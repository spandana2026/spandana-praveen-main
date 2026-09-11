import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const exists=p=>fs.existsSync(path.join(ROOT,p));
const command=c=>{try{execFileSync('sh',['-lc',`command -v ${c}`],{stdio:'ignore'});return true;}catch{return false;}};
const checks=[
 ['Repository source','git repository',exists('.git')],
 ['Frontend rebuild','frontend package',exists('frontend/package.json')],
 ['Backend rebuild','backend package',exists('backend/package.json')],
 ['JSON data backup source','backend/data',exists('backend/data')],
 ['Media backup source','backend/uploads',exists('backend/uploads')],
 ['Recovery password flow','Admin login recovery',exists('frontend/src/pages/admin/index.tsx')],
 ['Docker restart','docker-compose restart policy',exists('docker-compose.yml')],
 ['PM2 deployment path','deploy.sh',exists('deploy.sh')],
 ['MongoDB dump tool','mongodump command',command('mongodump')],
 ['MongoDB restore tool','mongorestore command',command('mongorestore')],
];
console.log(JSON.stringify({generatedAt:new Date().toISOString(),checks:checks.map(([name,detail,ok])=>({name,detail,status:ok?'available':'not-available'})),requiredExternalResources:['repository access','deployment host access','external backup destination','MongoDB credentials when MongoDB is used'],note:'This report describes the recovery tooling shipped with the repository; it does not prove that an external provider or off-site backup is configured.'},null,2));
