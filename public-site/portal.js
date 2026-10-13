/* Session, email and codes remain in this page's memory; no URL tokens or browser storage. */
(() => {
 const config=window.HEADS_PUBLIC;
 const node=id=>document.getElementById(id);
 let email='',token='',request='',busy=false;
 const message=text=>{node('message').textContent=text;};
 async function api(path,body,method='POST'){
  const response=await fetch(`${config.backend}${path}`,{method,cache:'no-store',referrerPolicy:'no-referrer',
   headers:{apikey:config.key,'Content-Type':'application/json',Authorization:`Bearer ${token||config.key}`},
   ...(method==='POST'?{body:JSON.stringify(body)}:{})});
  const data=await response.json();
  if(!response.ok)throw new Error('Unable to confirm this action. Check your connection or request a fresh code. No account is created by this portal.');
  return data;
 }
 function clear(){token='';email='';request='';node('email').value='';node('login-code').value='';node('delete-code').value='';node('ack').checked=false;
  for(const id of ['login','verify','request','confirm','status'])node(id).hidden=true;
 }
 async function deletion(operation,code){
  const data=await api('/functions/v1/delete-account',operation==='status'?null:{operation,request_id:request,...(code?{code}:{})},operation==='status'?'GET':'POST');
  if(data.status==='deleted'){clear();message('Account deleted. You can continue browsing Heads as a guest.');return;}
  if(data.status==='sent'){node('confirm').hidden=false;node('status').hidden=false;message('Enter the fresh deletion code and confirm within five minutes.');}
  else if(data.status==='exists')message('Your account still exists. Retry confirmation with the same code, or request a new code if it expired.');
  else throw new Error('Deletion could not be confirmed. Use Check deletion status before trying again.');
 }
 function bind(id,operation){
  const element=node(id);
  element.addEventListener(element.tagName==='FORM'?'submit':'click',async event=>{
   event.preventDefault();if(busy)return;busy=true;
   const controls=[...document.querySelectorAll('button,input')];controls.forEach(control=>{control.disabled=true;});
   try{await operation();}catch(error){message(error.message);if(token)node('status').hidden=false;}
   finally{busy=false;controls.forEach(control=>{control.disabled=false;});}
  });
 }
 bind('login',async()=>{email=node('email').value.trim();await api('/auth/v1/otp',{email,create_user:false});node('verify').hidden=false;message('Check your email for a sign-in code.');});
 bind('verify',async()=>{const data=await api('/auth/v1/verify',{email,token:node('login-code').value.trim(),type:'email'});
  if(!data.access_token)throw new Error('Unable to sign in.');token=data.access_token;node('login-code').value='';node('login').hidden=true;node('verify').hidden=true;node('request').hidden=false;node('status').hidden=false;message('Signed in. Request a fresh deletion code to continue.');});
 bind('request',async()=>{request=crypto.randomUUID();node('delete-code').value='';node('ack').checked=false;await deletion('request');});
 bind('confirm',()=>deletion('confirm',node('delete-code').value.trim()));
 bind('status',()=>deletion('status'));
 window.addEventListener('pagehide',clear);
})();
