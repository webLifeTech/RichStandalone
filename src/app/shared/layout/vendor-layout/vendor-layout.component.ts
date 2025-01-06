import { Component } from '@angular/core';
import { LayoutComponent } from '../../components/ui/layout/layout.component';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { BreadcrumbsComponent } from '../../components/comman/breadcrumbs/breadcrumbs.component';
import { UserDashboardTopTabBarComponent } from '../../../modules/user-dashboard/user-dashboard-top-tabbar/user-dashboard-top-tabbar.component';
import { ModalComponent } from '../../components/comman/modal/modal.component';
import { VendorDashboardTopTabBarComponent } from '../../../modules/vendor/vendor-dashboard-top-tabbar/vendor-dashboard-top-tabbar.component';

@Component({
  selector: 'app-vendor-layout',
  standalone: true,
  imports: [
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    BreadcrumbsComponent,
    ModalComponent,
    VendorDashboardTopTabBarComponent,
    RouterOutlet,
    CommonModule
  ],
  templateUrl: './vendor-layout.component.html',
  styleUrl: './vendor-layout.component.scss'
})
export class VendorLayoutComponent {

  public bg_image = 'assets/images/inner-bg.jpg';
  public title = 'My Profile';
  public parent = 'Home';
  public child = 'My Profile';

  public activeTab: string = 'My Bookings'; //dashboard

  public userDashboardTopTabs: any = [
    {
      title: "userDashboard.kyc.toptabs.dashboard",
      value: "Dashboard",
      icon: "assets/images/icon/dashboard/dashboard-icon.svg"
    },
    {
      title: "userDashboard.kyc.toptabs.messages",
      value: "Messages",
      icon: "assets/images/icon/dashboard/message-icon.svg"
    },
    {
      title: "userDashboard.kyc.toptabs.my_profile",
      value: "My Profile",
      // route: "/user/my-profile",
      icon: "assets/images/icon/dashboard/user-icon.svg"
    },
    {
      title: "userDashboard.kyc.toptabs.settings",
      value: "Settings",
      icon: "assets/images/icon/dashboard/settings-icon.svg"
    },
  ];

  constructor(
    public router: Router
  ) {
    if (this.router.url.includes('/user/my-bookings')) {
      this.title = "My Bookings";
      this.child = "My Bookings";
    }
  }

  getTabValue(value: string) {
    this.activeTab = value;
    this.title = value;
    this.child = value;
  }

}
