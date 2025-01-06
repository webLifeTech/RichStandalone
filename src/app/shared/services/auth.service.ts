import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from './global.service';
// import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLoggedIn: boolean;
  loggedInUserInfo: any = {};

  constructor(
    private router: Router,
    private gs: GlobalService,
  ) {
    this.isLoggedIn = localStorage.getItem('loggedIn') === 'true' || false;
  }

  login(data: any) {
    this.isLoggedIn = true;
    if (this.isLoggedIn) {
      this.loggedInUserInfo = data;
      this.gs.loggedInUserInfo = this.loggedInUserInfo;
      localStorage.setItem('loggedIn', 'true');
      localStorage.setItem('loggedInUser', JSON.stringify(data));
      if (this.loggedInUserInfo.role === 'admin') {
        this.router.navigateByUrl('/admin/dashboard');
      } else {
        this.router.navigateByUrl('/cab/listing/list-view');
      }
      // this.toast.successToastr("LoggedIn Successfully");
    }
  }

  register(data: any) {
    this.isLoggedIn = true;
    if (this.isLoggedIn) {
      this.loggedInUserInfo = data;
      this.gs.loggedInUserInfo = this.loggedInUserInfo;
      localStorage.setItem('loggedIn', 'true');
      localStorage.setItem('loggedInUser', JSON.stringify(data));
      this.router.navigateByUrl('/cab/listing/list-view');
      // this.toast.successToastr("Registration Successfully");
    }
  }

  logOut() {
    this.isLoggedIn = false;
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('loggedInUser');
    this.router.navigateByUrl('/home');
  }
}
