import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../../shared/services/toast.service';
import { GlobalService } from '../../../shared/services/global.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-user-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    RouterLinkActive,
    NgbModule,
    TranslateModule,
    RouterOutlet
  ],
  templateUrl: './user-settings.component.html',
  styleUrl: './user-settings.component.scss'
})
export class UserSettingsComponent {

  activeKycTab: any = "";
  sideTabs: any = [
    {
      title: "Security",
      value: "Security",
      route: "/user/settings/security",
      icon: "feather icon-shield"
    },
    {
      title: "Preferences",
      value: "Preferences",
      route: "/user/settings/preferences",
      icon: "feather icon-star"
    },
    {
      title: "Notifications",
      value: "Notifications",
      route: "/user/settings/notifications",
      icon: "feather icon-bell"
    }
  ];

  constructor(
    // private data: DataService,
    private router: Router,
    private route: ActivatedRoute,
    private toast: ToastService,
    public gs: GlobalService,
    private modalService: NgbModal,

  ) {
    this.route.queryParams.subscribe((params) => {
    })
  }

  changeKycTab(tab: any) {
    this.activeKycTab = tab;
    window.scrollTo({ top: 300, behavior: 'smooth' });
  }

}
