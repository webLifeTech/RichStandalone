import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../../../shared/services/toast.service';
import { GlobalService } from '../../../../shared/services/global.service';
import { routes } from '../../../../app.routes';
import { MatSelectModule } from '@angular/material/select';
import { SettingsService } from '../../../../shared/services/setting.service';
interface data {
  value: string;
}
@Component({
  selector: 'app-preferences',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    NgbModule,
    MatSelectModule
  ],
  templateUrl: './preferences.component.html',
  styleUrl: './preferences.component.scss'
})
export class PreferencesComponent {
  settingsDetails: any = [];
  public routes = routes;
  public selectedValue1!: string;
  public selectedValue2!: string;
  selectedList1: data[] = [
    { value: 'English' },
    { value: 'Japanese' },

  ];
  selectedList2: data[] = [
    { value: 'United States (English)' },
    { value: 'Japan (Japanese)' },

  ];

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
      "type": "Preferences",
    }
    this.gs.isSpinnerShow = true;
    this.settingsService.GetSettingsDetails(body).subscribe((response: any) => {
      this.gs.isSpinnerShow = false;
      if (response) {
        this.settingsDetails = JSON.parse(response)?.settingTabs || [];
        console.log("Preferences Details >>>>>", this.settingsDetails);
      }
    }, (err: any) => {
      this.gs.isSpinnerShow = false;
    })
  }

}
