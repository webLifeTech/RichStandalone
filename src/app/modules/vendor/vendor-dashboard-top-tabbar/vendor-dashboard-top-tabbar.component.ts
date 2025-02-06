import { Component, EventEmitter, Input, Output } from '@angular/core';
import { tabs } from '../../../shared/interface/pages';
import { TranslateModule } from '@ngx-translate/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-vendor-dashboard-top-tabbar',
  standalone: true,
  imports: [
    TranslateModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './vendor-dashboard-top-tabbar.component.html',
  styleUrl: './vendor-dashboard-top-tabbar.component.scss'
})
export class VendorDashboardTopTabBarComponent {

  public tabs: any = [
    {
      title: "userDashboard.kyc.toptabs.dashboard",
      value: "Dashboard",
      icon: "assets/images/icon/dashboard/dashboard-icon.svg",
      route: "/vendor/dashboard",
    },
    {
      title: "userDashboard.kyc.toptabs.enquiries",
      value: "Enquiries",
      icon: "assets/images/icon/dashboard/message-icon.svg",
      route: "/vendor/enquiries",
    },
    {
      title: "userDashboard.kyc.toptabs.my_profile",
      value: "My Profile",
      icon: "assets/images/icon/dashboard/user-icon.svg",
      route: "/vendor/service-profile"
    },
    {
      title: "userDashboard.kyc.toptabs.settings",
      value: "Settings",
      icon: "assets/images/icon/dashboard/settings-icon.svg"
    },
  ];

  @Output() tabValue = new EventEmitter<string>();

  public activeTab = 'My Profile';

  constructor(
    public router: Router
  ) {
    // if (this.router.url.includes('/user/my-bookings')) {
    //   this.activeTab = "My Bookings";
    // }
    // if (this.router.url.includes('/user/my-payments')) {
    //   this.activeTab = "Payments";
    // }
    // this.changeTab(this.activeTab);
  }

  changeTab(value: string) {
    this.activeTab = value;
    this.tabValue.emit(this.activeTab)
  }
}
