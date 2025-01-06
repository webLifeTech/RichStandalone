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

  @Input() tabs: tabs[];

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
