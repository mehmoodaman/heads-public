import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,readFile,readdir} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {build,configuration} from './build.mjs';
const fixture={HEADS_SUPPORT_EMAIL:'support@example.test',HEADS_PUBLIC_OPERATOR:'Test operator',HEADS_PUBLIC_SITE_URL:'https://example.test/heads',EXPO_PUBLIC_SUPABASE_URL:'https://backend.example.test',EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY:'sb_publishable_fixture',HEADS_SENTRY_RETENTION_DAYS:'30'};
test('publishing requires owner identity, HTTPS and client-only credentials',()=>{
 assert.throws(()=>configuration({}));assert.throws(()=>configuration({...fixture,HEADS_SUPPORT_EMAIL:''}));
 assert.throws(()=>configuration({...fixture,EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY:'sb_secret_fixture'}));
 assert.throws(()=>configuration({...fixture,HEADS_PUBLIC_SITE_URL:'http://example.test'}));
});
test('only dedicated public pages and assets are published; operator text is escaped',async()=>{
 const directory=await mkdtemp(join(tmpdir(),'heads-public-'));
 await build({...fixture,HEADS_PUBLIC_OPERATOR:'<script>unsafe</script>'},directory);
 assert.deepEqual((await readdir(directory)).sort(),['config.js','delete-account.html','portal.js','privacy.html','style.css','support.html','terms.html']);
 assert.match(await readFile(join(directory,'privacy.html'),'utf8'),/&lt;script&gt;/);
 const portal=await readFile(join(directory,'portal.js'),'utf8');
 assert.match(portal,/create_user:false/);assert.match(portal,/\/functions\/v1\/delete-account/);
 assert.doesNotMatch(portal,/localStorage|sessionStorage|console\./);
});
