import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../../../shared/services/toast.service';
import { GlobalService } from '../../../../shared/services/global.service';
import { SettingsService } from '../../../../shared/services/setting.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [

    CommonModule,
    FormsModule,
    RouterLink,
    NgbModule,
  ],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent {
  settingsDetails: any = [];
  constructor(
    private toast: ToastService,
    public gs: GlobalService,
    private settingsService: SettingsService,
  ) {
    this.getSettingsDetails();
  }

  getSettingsDetails() {
    let body = {
      "userId": this.gs.loggedInUserInfo.userId,
      "type": "Notifications",
    }
    this.gs.isSpinnerShow = true;
    this.settingsService.GetSettingsDetails(body).subscribe((response: any) => {
      this.gs.isSpinnerShow = false;
      if (response) {
        this.settingsDetails = JSON.parse(response)?.settingTabs || [];
        console.log("Notifications Details >>>>>", this.settingsDetails);
      }
    }, (err: any) => {
      this.gs.isSpinnerShow = false;
    })
  }

  updateSettingsDetails(item: any) {
    let body = {
      "userId": this.gs.loggedInUserInfo.userId,
      "code": item.Code,
      "value": null,
      "isActive": !item.IsActive
    }
    this.gs.isSpinnerShow = true;
    this.settingsService.UpdateSettingsDetails(body).subscribe((res: any) => {
      this.gs.isSpinnerShow = false;
      if (res && res.statusCode == "200") {
        this.toast.successToastr(res.message);
        this.getSettingsDetails();
      } else {
        this.toast.errorToastr(res.message);
      }
    }, (err: any) => {
      this.gs.isSpinnerShow = false;
    })
  }

}
