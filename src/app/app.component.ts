import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { GlobalService } from './shared/services/global.service';
import { CommonModule } from '@angular/common';

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
  ) {
    this.gs.loggedInUserInfo = localStorage.getItem('loggedInUser') ? JSON.parse(localStorage.getItem('loggedInUser') || "") : {};

    const savedLang = localStorage.getItem('language');
    const browserLang = this.translate.getBrowserLang();
    const lang = savedLang || browserLang || this.defaultLang;
    this.translate.setDefaultLang(this.defaultLang);
    this.translate.use(lang);
  }
}
