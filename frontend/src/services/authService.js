export const authService = {
  async adminLogin(password) { return fetch('/api/v1/auth/admin/login',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'include',body:JSON.stringify({password})}).then(async r=>{const d=await r.json();if(!r.ok) throw new Error(d.error||'Login failed');return d;}); },
  async logout(){ await fetch('/api/v1/auth/logout',{method:'POST',credentials:'include'}); },
  async session(){ const r=await fetch('/api/v1/auth/admin/session',{credentials:'include'}); return r.ok; },
};
