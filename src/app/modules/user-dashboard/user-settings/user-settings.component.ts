import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../../shared/services/toast.service';
import { GlobalService } from '../../../shared/services/global.service';
import { TranslateModule } from '@ngx-translate/core';
import { ProfileService } from '../../../shared/services/profile.service';
import { SecurityComponent } from './security/security.component';
import { PreferencesComponent } from './preferences/preferences.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { SettingsService } from '../../../shared/services/setting.service';

@Component({
  selector: 'app-user-settings',
  standalone: true,
  imports: [
    SecurityComponent,
    PreferencesComponent,
    NotificationsComponent,
    CommonModule,
    FormsModule,
    NgbModule,
    TranslateModule,
  ],
  templateUrl: './user-settings.component.html',
  styleUrl: './user-settings.component.scss'
})
export class UserSettingsComponent {

  activeKycTab: any = "";
  sidebarTabs: any = [];

  constructor(
    private route: ActivatedRoute,
    public gs: GlobalService,
    private profileService: ProfileService,
    private settingsService: SettingsService,
  ) {
    this.route.queryParams.subscribe((params) => {
      this.getConfigUIForms();
    })
  }

  getConfigUIForms() {

    let body = {
      "stateCode": "42",
      "languageId": 1,
      "roleName": this.gs.loggedInUserInfo.roleName || null,
      "countryId": 230,
      "transactionId": 1,
      "menuId": 28
    }
    this.profileService.getConfigUIForms(body).subscribe((response: any) => {
      this.gs.isSpinnerShow = false;
      if (response && response.length) {
        this.sidebarTabs = response;
        this.filter();
      }
    }, (err: any) => {
      this.gs.isSpinnerShow = false;
    })
  }

  filter() {
    this.activeKycTab = "";
    let activeInx = 0;
    setTimeout(() => {

      const sidebarTab = this.sidebarTabs[activeInx];
      this.activeKycTab = sidebarTab.formId; // need to do 0
      for (let i in this.sidebarTabs) {
        this.sidebarTabs[i].isHidden = false;
      }
    }, 200);
    return;
  }

  changeKycTab(tab: any) {
    this.activeKycTab = tab.formId;
    window.scrollTo({ top: 300, behavior: 'smooth' });
  }

}
