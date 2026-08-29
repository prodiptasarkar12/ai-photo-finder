const ADMIN_ID='admin';
const ADMIN_PASSWORD='LensFind@2026';
const isAdmin=()=>sessionStorage.getItem('lensfind-admin')==='1';
const adminPages=new Set(['dashboard','events','qr']);
const originalShowPage=window.showPage;
window.showPage=function(id){
  if(adminPages.has(id)&&!isAdmin()){ originalShowPage('login'); return; }
  if(id==='login'&&isAdmin()){ originalShowPage('dashboard'); return; }
  originalShowPage(id);
};
function refreshAdminUI(){
  document.querySelectorAll('.admin-only').forEach(el=>el.style.display=isAdmin()?'':'none');
  const loginBtn=document.getElementById('adminLoginBtn');
  if(loginBtn) loginBtn.style.display=isAdmin()?'none':'';
}
function doLogin(){
  const id=document.getElementById('adminId')?.value.trim();
  const pw=document.getElementById('adminPassword')?.value;
  const error=document.getElementById('loginError');
  if(id===ADMIN_ID&&pw===ADMIN_PASSWORD){
    sessionStorage.setItem('lensfind-admin','1');
    if(error) error.textContent='';
    refreshAdminUI();
    window.showPage('dashboard');
  }else if(error){ error.textContent='Invalid Admin ID or password.'; }
}
function logout(){sessionStorage.removeItem('lensfind-admin');refreshAdminUI();window.showPage('guest');}
document.addEventListener('click',(event)=>{
  const a=event.target.closest('a[href]');
  if(a){
    const id=a.getAttribute('href')?.replace(/^#/,'');
    if(id==='login' || adminPages.has(id)){
      event.preventDefault();event.stopImmediatePropagation();window.showPage(id);return;
    }
  }
  if(event.target.closest('#adminLoginBtn')){event.preventDefault();window.showPage('login');return;}
  if(event.target.closest('#loginSubmit')){event.preventDefault();doLogin();return;}
  if(event.target.closest('#logoutBtn')){event.preventDefault();logout();return;}
  const qr=event.target.closest('button');
  if(qr && qr.textContent.includes('QR code') && !isAdmin()){event.preventDefault();event.stopImmediatePropagation();window.showPage('login');}
},true);
document.addEventListener('DOMContentLoaded',()=>{
  refreshAdminUI();
  if(new URLSearchParams(location.search).get('view')==='guest') window.showPage('guest');
  else if(location.hash==='#login') window.showPage('login');
  else if(isAdmin()) window.showPage('dashboard');
  else window.showPage('guest');
});
