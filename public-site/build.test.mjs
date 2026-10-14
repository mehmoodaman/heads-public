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

test('disabled Sentry needs no retention declaration and makes no collection claim',async()=>{
 const directory=await mkdtemp(join(tmpdir(),'heads-public-disabled-'));
 await build({...fixture,HEADS_SENTRY_RETENTION_DAYS:undefined},directory);
 const privacy=await readFile(join(directory,'privacy.html'),'utf8');
 assert.match(privacy,/Sentry diagnostics are disabled for this beta/);
 assert.doesNotMatch(privacy,/It also sends sanitized|expire after null/);
 assert.throws(()=>configuration({...fixture,HEADS_SENTRY_RETENTION_DAYS:'0'}));
});
test('only dedicated public pages and assets are published; operator text is escaped',async()=>{
 const directory=await mkdtemp(join(tmpdir(),'heads-public-'));
 await build({...fixture,HEADS_PUBLIC_OPERATOR:'<script>unsafe</script>'},directory);
 assert.deepEqual((await readdir(directory)).sort(),['config.js','delete-account.html','index.html','portal.js','privacy.html','style.css','support.html','terms.html']);
 assert.match(await readFile(join(directory,'privacy.html'),'utf8'),/&lt;script&gt;/);
 const portal=await readFile(join(directory,'portal.js'),'utf8');
 assert.match(portal,/create_user:false/);assert.match(portal,/\/functions\/v1\/delete-account/);
 assert.doesNotMatch(portal,/localStorage|sessionStorage|console\./);
});

test('homepage and document navigation publish together without external resources',async()=>{
 const directory=await mkdtemp(join(tmpdir(),'heads-public-design-'));
 await build(fixture,directory);
 const home=await readFile(join(directory,'index.html'),'utf8');
 assert.match(home,/Coming soon to iPhone/);
 assert.doesNotMatch(home,/for the love of pickup|basketball first\. always about playing\./i);
 assert.match(home,/<meta name="theme-color" content="#191819">/);
 assert.match(home,/not live activity/);
 for(const slug of ['privacy','terms','support','delete-account']){
  assert.ok(home.includes('href="'+slug+'.html"'));
  const page=await readFile(join(directory,slug+'.html'),'utf8');
  assert.ok(page.includes('href="index.html"'));
  assert.ok(page.includes('href="'+slug+'.html" aria-current="page"'));
  assert.match(page,/class="document"/);
 }
 assert.doesNotMatch(home,/(?:src|href)="http[s]?:/);
});
