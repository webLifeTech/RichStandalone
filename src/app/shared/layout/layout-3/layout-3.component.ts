import { Component } from '@angular/core';
import { LayoutComponent } from '../../components/ui/layout/layout.component';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { BreadcrumbsComponent } from '../../components/comman/breadcrumbs/breadcrumbs.component';
import { UserDashboardTopTabBarComponent } from '../../../modules/user-dashboard/user-dashboard-top-tabbar/user-dashboard-top-tabbar.component';
import { ModalComponent } from '../../components/comman/modal/modal.component';

@Component({
  selector: 'app-layout-3',
  standalone: true,
  imports: [
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    BreadcrumbsComponent,
    ModalComponent,
    UserDashboardTopTabBarComponent,
    RouterOutlet,
    CommonModule
  ],
  templateUrl: './layout-3.component.html',
  styleUrl: './layout-3.component.scss'
})
export class Layout3Component {

  public bg_image = 'assets/images/inner-bg.jpg';
  public title = 'My Profile';
  public parent = 'Home';
  public parentRoute = '/home';
  public child = 'My Profile';

  public activeTab: string = 'My Bookings'; //dashboard

  constructor(
    public router: Router
  ) {
    if (this.router.url.includes('/user/booking')) {
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
