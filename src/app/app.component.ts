import { ChangeDetectorRef, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { GlobalService } from './shared/services/global.service';
import { CommonModule } from '@angular/common';
import * as AOS from 'aos'; // Import AOS
import { SignalRService } from './shared/services/signalr.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'rich-standalone';
  private defaultLang = 'en';
  constructor(
    private translate: TranslateService,
    public gs: GlobalService,
    public signalR: SignalRService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.gs.loggedInUserInfo = localStorage.getItem('loggedInUser') ? JSON.parse(localStorage.getItem('loggedInUser') || "") : {};

    const savedLang = localStorage.getItem('language');
    const browserLang = this.translate.getBrowserLang();
    const lang = savedLang || browserLang || this.defaultLang;
    this.translate.setDefaultLang(this.defaultLang);
    this.translate.use(lang);
  }

  ngOnInit() {
    this.connect();
    AOS.init({
      duration: 800,  // animation duration
      once: true,     // whether animation should happen only once
    }); // Initialize AOS
  }

  connect() {
    this.signalR.connect(this.gs.loggedInUserInfo.access_token, (msg, msgType) => {
      // this.notificationList = JSON.parse(msg);
      console.log('msgType >>>', msgType);
      console.log('notificationList >>>', msg);
      if (msgType === 'updatewallet') {
        this.signalR.walletInfo = JSON.parse(msg);
      }
      if (msgType === 'receiveNotification') {
        this.signalR.notification.unshift(msg);
      }
      this.changeDetectorRef.detectChanges();
    }).then((id) => {
      console.log('ConnectANI Connection successfully', String(id));
    }).catch((error) => {
      console.log("Connection failed >>>>", error);
    });
  }
}
