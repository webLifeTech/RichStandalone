import { Component, EventEmitter, Input, Output } from '@angular/core';
import { tabs } from '../../../shared/interface/pages';
import { TranslateModule } from '@ngx-translate/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { GlobalService } from '../../../shared/services/global.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../shared/services/auth.service';
import { RolePermissionService } from '../../../shared/services/rolepermission.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InformationModalComponent } from '../../../shared/components/comman/modal/information-modal/information-modal.component';
import { filter } from 'rxjs/operators';


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
  menuItems: any = [];
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
      route: "/user/booking",
      icon: "assets/images/icon/dashboard/booking-icon.svg"
    },
    {
      id: 102,
      visible: false,
      title: "userDashboard.kyc.toptabs.my_car_bookings",
      value: "My Car Bookings",
      route: "/user/booking",
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
      route: "/user/wallet",
      icon: "assets/images/icon/dashboard/wallet-icon.svg"
    },
    {
      id: 6,
      visible: false,
      title: "userDashboard.kyc.toptabs.payments",
      value: "Payments",
      route: "/user/payments",
      icon: "assets/images/icon/dashboard/payment-icon.svg"
    },
    {
      id: 7,
      visible: false,
      title: "userDashboard.kyc.toptabs.my_profile",
      value: "My Profile",
      route: "/user/profile",
      icon: "assets/images/icon/dashboard/kyc.svg"
    },
    {
      id: 8,
      visible: false,
      title: "userDashboard.kyc.toptabs.settings",
      value: "Settings",
      route: "/user/setting/security",
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
      route: "/user/configuration/0",
      icon: "assets/images/icon/dashboard/booking-icon.svg"
    },
    {
      id: 14,
      visible: false,
      title: "userDashboard.kyc.toptabs.recent_activity",
      value: "Recent Activity",
      route: "/user/recent-activity",
      icon: "assets/images/icon/dashboard/booking-icon.svg"
    },
    {
      id: 15,
      visible: false,
      title: "userDashboard.kyc.toptabs.my_profile",
      value: "My Profile",
      route: "/admin/my-profile",
      icon: "assets/images/icon/dashboard/kyc.svg"
    },
  ];

  accessList: any = {
    "admin": [101, 6, 15, 8, 10, 11, 12], //
    "user": [1, 2, 3, 4, 5, 6, 7, 8, 13, 14], // Driver
    "user_2": [1, 102, 3, 4, 5, 6, 7, 8, 9, 13], //
    "user_3": [1, 102, 3, 4, 5, 6, 7, 8, 9, 13], // Fleetowner
    "user_4": [1, 2, 3, 4, 5, 6, 7, 8, 9, 13], //
  }

  @Output() tabValue = new EventEmitter<string>();

  public activeTab = '';

  constructor(
    public router: Router,
    public gs: GlobalService,
    public roleService: RolePermissionService,
    public auth: AuthService,
    private modalService: NgbModal,
  ) {

    if (this.auth.isLoggedIn) {
      this.GetUsrMenuDetails();
      this.getProgress();
      this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe((event: any) => {
          this.activeTab = event.urlAfterRedirects?.split('?')[0]; // event.urlAfterRedirects;
        });
    }
  }

  GetUsrMenuDetails() {
    this.roleService.GetUsrMenuDetails({
      userName: this.gs.loggedInUserInfo.userNameId || "",
      systemId: "tlcHubAuthApp"
    }).subscribe((res: any) => {
      this.menuItems = res.filter((tRow: any) => tRow.parentMenuId == 19);
      this.menuItems = this.menuItems.sort((a: any, b: any) => a.sortPriority - b.sortPriority);
    })
  }

  getProgress() {
    const body = {
      "userId": this.gs.loggedInUserInfo.userId,
    }
    this.gs.GetUserProgressBarDetails(body).subscribe(async (response: any) => {
      if (response.response && response.response.statusCode == "200") {
        this.gs.progressSteps = this.applyActiveStatus(response.progressBars);
      }
    }, (error: any) => {
      this.gs.isSpinnerShow = false;
    })
  }

  changeTab(tab: any) {

    let isKycPending = true;
    const checkComplate = this.gs.progressSteps.find((i: any) => i.route == tab.menuUrl);
    const skipRoutes = ['/user/dashboard'];
    if (checkComplate && (checkComplate.status === 'Completed' || checkComplate.status === 'Partially Completed' || checkComplate.status === 'Active')) {
      isKycPending = false;
    }
    if (skipRoutes.indexOf(tab.menuUrl) !== -1) {
      isKycPending = false;
    }

    if (isKycPending) {
      let checkCurrentTab = this.gs.progressSteps.find((i: any) => i.route == this.activeTab);

      if (!checkCurrentTab || (checkCurrentTab && checkCurrentTab.status === 'Completed')) {
        checkCurrentTab = this.gs.progressSteps.find((i: any) => i.status == 'Active' || i.status === 'Partially Completed');
      }

      if (checkCurrentTab && checkCurrentTab.route !== '/user/wallet') {
        const modalRef = this.modalService.open(InformationModalComponent, {
          centered: true,
        });
        modalRef.componentInstance.mainTitle = `⚠️ ${checkCurrentTab.module} is ${checkCurrentTab.status === 'Active' ? 'Pending' : checkCurrentTab.status}`;
        modalRef.componentInstance.title = `Please complete ${checkCurrentTab.module} to access other sections.`;
        modalRef.result.then((res: any) => {
          if (res.confirmed) {
            this.router.navigate([checkCurrentTab.route]);
          }
        });
        return;
      }
    }

    this.activeTab = tab.menuUrl;
    this.tabValue.emit(tab.name);
    this.router.navigate([tab.menuUrl]);
  }

  applyActiveStatus(steps: any[]): any[] {
    let makeNextActive = false;
    return steps.map((step, index) => {

      // Reset any wrong Active from API
      let status: any = step.status;

      if (status === 'Completed') {
        makeNextActive = true;
        return { ...step };
      }

      if (status === 'Partially Completed') {
        makeNextActive = false;
        return { ...step };
      }

      // First Pending after Completed → Active
      if (status === 'Pending' && index === 0) {
        makeNextActive = false;
        return { ...step, status: 'Active' };
      }
      // First Pending after Completed → Active
      if (status === 'Pending' && makeNextActive) {
        makeNextActive = false;
        return { ...step, status: 'Active' };
      }

      return { ...step };
    });
  }
}


