import { Component, EventEmitter, Input, Output } from '@angular/core';
import { tabs } from '../../../shared/interface/pages';
import { TranslateModule } from '@ngx-translate/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { GlobalService } from '../../../shared/services/global.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-user-dashboard-top-tabbar',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './user-dashboard-top-tabbar.component.html',
  styleUrl: './user-dashboard-top-tabbar.component.scss'
})
export class UserDashboardTopTabBarComponent {

  // @Input() tabs: tabs[];

  public userDashboardTopTabs: any = [
    {
      id: 101,
      visible: false,
      title: "adminDashboard.toptabs.dashboard",
      value: "Dashboard",
      route: "/admin/dashboard",
      icon: "assets/images/icon/dashboard/dashboard-icon.svg"
    },
    {
      id: 1,
      visible: false,
      title: "userDashboard.kyc.toptabs.dashboard",
      value: "Dashboard",
      route: "/user/dashboard",
      icon: "assets/images/icon/dashboard/dashboard-icon.svg"
    },
    {
      id: 2,
      visible: false,
      title: "userDashboard.kyc.toptabs.my_bookings",
      value: "My Bookings",
      route: "/user/my-bookings",
      icon: "assets/images/icon/dashboard/booking-icon.svg"
    },
    {
      id: 102,
      visible: false,
      title: "userDashboard.kyc.toptabs.my_car_bookings",
      value: "My Car Bookings",
      route: "/user/my-bookings",
      icon: "assets/images/icon/dashboard/booking-icon.svg"
    },
    {
      id: 3,
      visible: false,
      title: "userDashboard.kyc.toptabs.reviews",
      value: "Reviews",
      route: "/user/reviews",
      icon: "assets/images/icon/dashboard/review-icon.svg"
    },
    {
      id: 4,
      visible: false,
      title: "userDashboard.kyc.toptabs.favourite",
      value: "Favourite",
      route: "/user/favourite",
      icon: "assets/images/icon/dashboard/wishlist-icon.svg"
    },
    {
      id: 5,
      visible: false,
      title: "userDashboard.kyc.toptabs.wallet",
      value: "Wallet",
      route: "/user/my-wallet",
      icon: "assets/images/icon/dashboard/wallet-icon.svg"
    },
    {
      id: 6,
      visible: false,
      title: "userDashboard.kyc.toptabs.payments",
      value: "Payments",
      route: "/user/my-payments",
      icon: "assets/images/icon/dashboard/payment-icon.svg"
    },
    {
      id: 7,
      visible: false,
      title: "userDashboard.kyc.toptabs.my_profile",
      value: "My Profile",
      route: "/user/my-profile",
      icon: "assets/images/icon/dashboard/kyc.svg"
    },
    {
      id: 8,
      visible: false,
      title: "userDashboard.kyc.toptabs.settings",
      value: "Settings",
      route: "/user/settings/security",
      icon: "assets/images/icon/dashboard/settings-icon.svg"
    },
    {
      id: 9,
      visible: false,
      title: "userDashboard.kyc.toptabs.my_cars",
      value: "My Cars",
      route: "/user/my-cars",
      icon: "assets/images/icon/dashboard/car.svg"
    },
    {
      id: 10,
      visible: false,
      title: "userDashboard.kyc.toptabs.all_user",
      value: "All User",
      route: "/admin/user-listing",
      icon: "assets/images/icon/dashboard/user-icon.svg"
    },
    {
      id: 11,
      visible: false,
      title: "userDashboard.kyc.toptabs.all_vehicles",
      value: "All Vehicles",
      route: "/admin/user-vehicles",
      icon: "assets/images/icon/dashboard/car.svg"
    },
    {
      id: 12,
      visible: false,
      title: "userDashboard.kyc.toptabs.booking_overview",
      value: "Booking Overview",
      route: "/admin/booking-overview",
      icon: "assets/images/icon/dashboard/booking-icon.svg"
    },
    {
      id: 13,
      visible: false,
      title: "userDashboard.kyc.toptabs.master_configuration",
      value: "Master Configuration",
      route: "/user/master-configuration",
      icon: "assets/images/icon/dashboard/booking-icon.svg"
    },
  ];

  accessList: any = {
    "admin": [101, 6, 8, 10, 11, 12], //
    "user": [1, 2, 3, 4, 5, 6, 7, 8, 13], // Driver
    "user_2": [1, 102, 3, 4, 5, 6, 7, 8, 9, 13], //
    "user_3": [1, 102, 3, 4, 5, 6, 7, 8, 9, 13], // Fleetowner
    "user_4": [1, 2, 3, 4, 5, 6, 7, 8, 9, 13], //
  }

  @Output() tabValue = new EventEmitter<string>();

  public activeTab = 'My Profile';

  constructor(
    public router: Router,
    public gs: GlobalService,
    public auth: AuthService,
  ) {

    if (this.auth.isLoggedIn) {
      for (let i in this.userDashboardTopTabs) {
        if (this.accessList[this.gs.loggedInUserInfo['role']].indexOf(this.userDashboardTopTabs[i].id) !== -1) {
          this.userDashboardTopTabs[i].visible = true;
        }
      }
    }

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
