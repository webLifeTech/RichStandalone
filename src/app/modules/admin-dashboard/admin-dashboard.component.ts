import { Component, HostListener } from '@angular/core';
import { PagesService } from '../../shared/services/pages.service';
import { GlobalService } from '../../shared/services/global.service';
import { BookingService } from '../../shared/services/booking.service';
import { Router } from '@angular/router';
import { NgbModal, NgbModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { AdBookingDetailsComponent } from './widgets/ad-booking-details/ad-booking-details.component';
import { ApexchartsComponent } from './widgets/apexcharts/apexcharts.component';
import { AdVehiclesDetailsComponent } from './widgets/ad-vehicles-details/ad-vehicles-details.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    ApexchartsComponent,
    AdBookingDetailsComponent,
    AdVehiclesDetailsComponent,

    CommonModule,
    FormsModule,
    NgbModule,
    NgxPaginationModule,
    MatMenuModule,
    MatButtonModule,
    NgbNavModule
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent {

  public bg_image = 'assets/images/inner-bg.jpg';
  public title = 'Admin dashboard';
  public parent = 'Home';
  public child = 'Admin dashboard';

  public isStuck: boolean = false;
  public isNotStuck: boolean = false;
  public isShowApproved: boolean = true;
  public isShowRefundRequest: boolean = true;

  dashboardDetails: any = {
    allBookings: 450,
    totalWalletBalance: 24665,
    totalTransactions: 15210,
    totalFavourite: 24,
    totalEarnings: 19999,
    totalRefunded: 1288,
  }
  myCarDetails: any = {
    totalUpcoming: 14,
    totalInprogress: 1,
    totalCompleted: 152,
    totalCancelled: 29,
  }
  bookingDetails: any = {
    totalUpcoming: 14,
    totalInprogress: 1,
    totalCompleted: 152,
    totalCancelled: 29,
  }
  overviewDetails: any = {
    dayTotalBooking: 2,
    oneWeekTotalBooking: 39,
    oneMonthTotalBooking: 60,
    threeMonthTotalBooking: 108,
    sixMonthTotalBooking: 152,
    oneYearTotalBooking: 467,
  }
  earningDetails: any = {
    dayTotalEarning: 100,
    oneWeekTotalEarning: 800,
    oneMonthTotalEarning: 3200,
    threeMonthTotalEarning: 9600,
  }

  approvedBookDetails: any = {
    "bookingId": "#1001",
    "carName": "Ferrari 458 MM Speciale",
    "deliveryStatus": "Delivery",
    "rentalType": "Hourly",
    "pickupDeliveryLocation1": "45, Avenue ,Mark Street,",
    "pickupDeliveryLocation2": "USA 15 Sep 2023, 09:30 AM",
    "dropoffLocation1": "21, Avenue, Windham,",
    "dropoffLocation2": "USA 15 Sep 2023, 11:30 AM",
    "bookedOn": "15 Sep 2023",
    "pickup_date_time": "15 Sep 2023, 09:00 AM",
    "end_date_time": "15 Sep 2023, 09:00 AM",
    "number_of_days": "3 days",
    "price_per_day": 30,
    "total_amount": 90,
    "status": "Upcoming",
    "img": "assets/images/cab/car/24.jpg"
  }

  bookingData = {
    upcomingList: [],
    inprogressList: [],
    completedList: [],
    cancelledList: [],
  }

  carOwnersData = [
    {
      "title": "Active",
      "total": "80"
    },
    {
      "title": "Inactive",
      "total": "20"
    },
    {
      "title": "KYC Pending",
      "total": "10"
    },
    {
      "title": "Booked",
      "total": "14"
    },
    {
      "title": "Availble",
      "total": "19"
    },
  ];

  userDetails: any = {
    "data": {
      "series": [
        {
          name: "Active",
          data: [44, 55, 57, 56]
        },
        {
          name: "Inactive",
          data: [76, 85, 101, 98]
        },
        {
          name: "KYC Pending",
          data: [35, 41, 36, 26]
        },
      ],
      "chartLabels": ["Car Owners (155)", "Drivers (181)", "Fleet Company (194)", "Driver Owned Cars (180)"],
      "chartColors": ["#dcc7fa", "#8e33ff"],
    }
  };

  @HostListener('window: scroll', [])
  onWindowScroll() {
    let number = window.pageYOffset || 0;

    if (number > 595) {
      this.isStuck = true;
      this.isNotStuck = false;
    } else {
      this.isStuck = false
    }
    if (number > 805) {
      this.isNotStuck = true;
      this.isStuck = false;
    }
  }

  constructor(
    private pageService: PagesService,
    public gs: GlobalService,
    private bookingService: BookingService,
    private router: Router,
    private modalService: NgbModal,
  ) {
    this.getTableData("");
  }

  getTableData(type: any) {
  }

  viewBooking(type: any) {
    let params = {
      activeTab: type
    }
    this.router.navigate(['/user/my-bookings'], {
      queryParams: params,
    });
  }

  viewUsers(type: any) {
    let params = {
      activeTab: type
    }
    this.router.navigate(['/admin/user-listing'], {
      queryParams: params,
    });
  }

  viewMyCars(type: any, status?: any) {
    let params = {
      activeTab: type,
      status: status || null
    }
    this.router.navigate(['/user/my-cars'], {
      queryParams: params,
    });
  }

  goWallet() {
    this.router.navigate(['/user/my-wallet']);
  }
  goTransactions() {
    this.router.navigate(['/user/my-payments']);
  }
  goWishlist() {
    this.router.navigate(['/user/favourite']);
  }
}
