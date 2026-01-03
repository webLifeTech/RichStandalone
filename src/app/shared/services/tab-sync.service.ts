import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TabSyncService {
  private channel: BroadcastChannel;
  private myTabId: string;

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {
    this.myTabId = Date.now().toString() + Math.random().toString();

    // 1. Shuru me khud ko active banao
    this.activateThisTab();

    this.channel = new BroadcastChannel('my_app_session_channel');
    this.initListener();
  }

  // Helper: Khud ko active banane ka logic
  private activateThisTab() {
    localStorage.setItem('active_tab_id', this.myTabId);
  }

  private initListener() {
    this.channel.onmessage = (event) => {
      // Agar naya tab khula hai (ya purane ne "Use Here" dabaya hai)
      if (event.data.type === 'NEW_TAB_OPENED' && event.data.id !== this.myTabId) {
        this.lockThisTab();
      }

      if (event.data.type === 'LOGOUT') {
        Swal.close();
        document.body.style.pointerEvents = 'auto';
        this.authService.resetStorage();
        this.router.navigateByUrl('/home');
      }
    };

    // Initial broadcast
    this.channel.postMessage({ type: 'NEW_TAB_OPENED', id: this.myTabId });

    window.addEventListener('storage', (event) => {
      if (event.key === 'active_tab_id' && event.newValue !== this.myTabId) {
        this.lockThisTab();
      }
    });
  }

  private lockThisTab() {
    // Agar pehle se Swal khula hai to naya mat kholo (optional check)
    if (Swal.isVisible()) return;

    Swal.fire({
      icon: 'warning',
      title: 'Session Ended',
      text: 'You have opened this application in another tab. This session is now closed.',// 'Application is open in another tab. This session is now closed. Click "Use Here" to continue working in this tab.',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      confirmButtonText: 'Use Here 🚀',
      confirmButtonColor: '#001940',

      // backdrop: `rgba(0,0,0,0.9)`
    }).then((result) => {
      if (result.isConfirmed) {
        this.reclaimSession();
      }
    });
    document.body.style.pointerEvents = 'none';
  }

  // ✅ Session wapis lene ka logic
  private reclaimSession() {
    this.activateThisTab();
    document.body.style.pointerEvents = 'auto';
    this.channel.postMessage({ type: 'NEW_TAB_OPENED', id: this.myTabId });
  }

  public logoutAllTabs() {
    this.channel.postMessage({ type: 'LOGOUT' });
  }
}
