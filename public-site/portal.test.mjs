import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';
import {webcrypto} from 'node:crypto';
test('web portal authenticates, requests fresh OTP, reconciles uncertain deletion and clears page state',async()=>{
 const ids=['login','verify','request','confirm','status','email','login-code','delete-code','ack','message'];
 const nodes=Object.fromEntries(ids.map(id=>[id,{value:'',hidden:false,checked:false,tagName:['login','verify','confirm'].includes(id)?'FORM':'BUTTON',addEventListener(_,listener){this.listener=listener;}}]));
 const calls=[],responses=[{},{access_token:'session-token'},{status:'sent'},new Error('offline'),{status:'deleted'}];
 const window={HEADS_PUBLIC:{backend:'https://backend.example.test',key:'sb_publishable_fixture'},addEventListener(){}};
 runInNewContext(await readFile(new URL('portal.js',import.meta.url),'utf8'),{window,document:{getElementById:id=>nodes[id],querySelectorAll:()=>Object.values(nodes)},crypto:webcrypto,
  fetch:async(url,options)=>{calls.push({url,options});const next=responses.shift();if(next instanceof Error)throw next;return {ok:true,json:async()=>next};},
 });
 const trigger=id=>nodes[id].listener({preventDefault(){}});
 nodes.email.value='owner@example.test';await trigger('login');
 assert.equal(JSON.parse(calls[0].options.body).create_user,false);
 nodes['login-code'].value='123456';await trigger('verify');assert.equal(nodes['login-code'].value,'');
 await trigger('request');assert.match(calls[2].url,/\/functions\/v1\/delete-account$/);
 const request=JSON.parse(calls[2].options.body).request_id;
 nodes['delete-code'].value='654321';nodes.ack.checked=true;await trigger('confirm');
 assert.equal(JSON.parse(calls[3].options.body).request_id,request);
 assert.equal(nodes.status.hidden,false);
 await trigger('status');assert.equal(calls[4].options.method,'GET');
 assert.match(nodes.message.textContent,/Account deleted/);assert.equal(nodes.email.value,'');assert.equal(nodes['delete-code'].value,'');assert.equal(nodes.confirm.hidden,true);
});
