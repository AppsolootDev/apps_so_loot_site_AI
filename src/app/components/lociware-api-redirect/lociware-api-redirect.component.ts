import { Component, OnInit } from '@angular/core';

const LOCIWARE_API_URL = 'https://github.com/AppsolootDev/Lociware/tree/flut/api/index.js';

@Component({
  selector: 'app-lociware-api-redirect',
  standalone: true,
  template: `
    <div style="
      display:flex;flex-direction:column;align-items:center;justify-content:center;
      min-height:100vh;background:#070e1a;color:#e8f4fd;font-family:Inter,sans-serif;gap:16px;
    ">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" style="animation:spin 1s linear infinite">
        <circle cx="12" cy="12" r="10" stroke="rgba(75,200,232,0.2)" stroke-width="2"/>
        <path d="M12 2a10 10 0 0 1 10 10" stroke="#4bc8e8" stroke-width="2" stroke-linecap="round"/>
      </svg>
      <p style="font-size:0.9rem;color:#7ca8c4">Redirecting to Lociware API repository…</p>
      <style>@keyframes spin{to{transform:rotate(360deg)}}</style>
    </div>
  `
})
export class LociwareApiRedirectComponent implements OnInit {
  ngOnInit() {
    window.location.href = LOCIWARE_API_URL;
  }
}
