import { Component, HostListener } from '@angular/core';
import { GlobalService } from '../../../shared/services/global.service';
import { CommonModule } from '@angular/common';
import { DocVehicleBookDetailsComponent } from '../widgets/dashboard/doc-vehicle-book-details/doc-vehicle-book-details.component';
import { DocTripBookDetailsComponent } from '../widgets/dashboard/doc-trip-book-details/doc-trip-book-details.component';
import { UserApexchartsComponent } from '../widgets/user-apexcharts/user-apexcharts.component';
import { CurrencySymbolPipe } from '../../../shared/pipe/currency.pipe';
import { BarRating } from 'ngx-bar-rating';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dash-driver-owned-car',
  standalone: true,
  imports: [
    UserApexchartsComponent,
    DocVehicleBookDetailsComponent,
    DocTripBookDetailsComponent,
    CommonModule,
    CurrencySymbolPipe,
    BarRating
  ],
  templateUrl: './dash-driver-owned-car.component.html',
  styleUrl: './dash-driver-owned-car.component.scss'
})
export class DashDriverOwnedCarComponent {

  public bg_image = 'assets/images/inner-bg.jpg';
  public title = 'dashboard';
  public parent = 'Home';
  public child = 'dashboard';

  dashboardDetails: any = {
    allBookings: 450,
    totalWalletBalance: 24665,
    totalTransactions: 15210,
    totalFavourite: 24,
    totalEarnings: 19999,
    totalRefunded: 1288,
    averageStartRating: 3,
    driverRiskScore: {
      "series": [80],
      "chartLabel": 80,
      "chartColors": ["#22c55e", "#77ed8b"],
    },
  }

  constructor(
    public gs: GlobalService,
    private router: Router,
  ) {
  }


  goWallet() {
    this.router.navigate(['/user/my-wallet']);
  }

  goWishlist() {
    this.router.navigate(['/user/favourite']);
  }

}
