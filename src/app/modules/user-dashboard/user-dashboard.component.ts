import { Component, HostListener } from '@angular/core';
import { PagesService } from '../../shared/services/pages.service';
import { Router } from '@angular/router';
import { routes } from '../../shared/routes/routes';
import { CommonModule } from '@angular/common';
import { NgbModal, NgbModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { CurrencySymbolPipe } from '../../shared/pipe/currency.pipe';
import { FormsModule } from '@angular/forms';
import { GlobalService } from '../../shared/services/global.service';
import { BookingService } from '../../shared/services/booking.service';
import { apiResultFormat } from '../../shared/services/model/model';
import { RefundStatusModalComponent } from '../../shared/components/comman/modal/booking-modals/refund-status-modal/refund-status-modal.component';
import { BookingStatusModalComponent } from '../../shared/components/comman/modal/booking-modals/booking-status-modal/booking-status-modal.component';
import { UserApexchartsComponent } from './widgets/user-apexcharts/user-apexcharts.component';
import { MyBookingDetailsComponent } from './widgets/dashboard/my-booking-details/my-booking-details.component';
import { BarRating } from 'ngx-bar-rating';
import { VehiclesDetailsComponent } from './widgets/dashboard/vehicles-details/vehicles-details.component';
import { CarOwnerBookingDetailsComponent } from './widgets/dashboard/carowner-booking-details/carowner-booking-details.component';
import { DocVehicleBookDetailsComponent } from './widgets/dashboard/doc-vehicle-book-details/doc-vehicle-book-details.component';
import { DocTripBookDetailsComponent } from './widgets/dashboard/doc-trip-book-details/doc-trip-book-details.component';
import { DashDriverOwnedCarComponent } from './dash-driver-owned-car/dash-driver-owned-car.component';
import { AdBookingDetailsComponent } from '../admin-dashboard/widgets/ad-booking-details/ad-booking-details.component';
import { ApexchartsComponent } from '../admin-dashboard/widgets/apexcharts/apexcharts.component';
import { AdVehiclesDetailsComponent } from '../admin-dashboard/widgets/ad-vehicles-details/ad-vehicles-details.component';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [
    MyBookingDetailsComponent,
    UserApexchartsComponent,
    VehiclesDetailsComponent,
    CarOwnerBookingDetailsComponent,
    DocVehicleBookDetailsComponent,
    DocTripBookDetailsComponent,
    DashDriverOwnedCarComponent,
    ApexchartsComponent,
    AdBookingDetailsComponent,
    AdVehiclesDetailsComponent,

    CommonModule,
    FormsModule,
    NgbModule,
    NgxPaginationModule,
    MatMenuModule,
    MatButtonModule,
    CurrencySymbolPipe,
    NgbNavModule,
    BarRating
  ],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.scss'
})
export class UserDashboardComponent {

  public bg_image = 'assets/images/inner-bg.jpg';
  public title = 'dashboard';
  public parent = 'Home';
  public child = 'dashboard';
  public routes = routes;

  public activeTab: string = 'My Profile'; //dashboard
  active = 1;
  public tableData: any = [];
  public showFilter = false;
  public searchDataValue = '';
  public lastIndex = 0;
  public pageSize = 10;
  public totalData = 0;
  public skip = 0;
  public limit: number = this.pageSize;
  public pageIndex = 0;
  public serialNumberArray: Array<number> = [];
  public currentPage = 1;
  public pageNumberArray: Array<number> = [];
  public pageSelection = [];
  public totalPages = 0;

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
    averageStartRating: 3,
    driverRiskScore: {
      "series": [80],
      "chartLabel": 80,
      "chartColors": ["#22c55e", "#77ed8b"],
    },
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
    // let tabName = this.booktabs.find((item: any) => item.value === type)?.title;
    // this.activeTabName = tabName;

    // if (type === "all_bookings") {
    //   this.bookingService.getUserBookings().subscribe((apiRes: apiResultFormat) => {
    //     this.totalData = apiRes.totalData;
    //     this.tableData = apiRes.data;
    //   });
    // }

    // if (type === "inprogress") {
    this.bookingService.getUserBookingInprogress().subscribe((apiRes: apiResultFormat) => {
      this.tableData = apiRes.data;
      this.totalData = apiRes.totalData;
      this.bookingData.inprogressList = apiRes.data;
    });
    // }
    // if (type === "upcoming") {
    this.bookingService.getUserBookingUpcoming().subscribe((apiRes: apiResultFormat) => {
      this.totalData = apiRes.totalData;
      this.bookingData.upcomingList = apiRes.data;
    });
    // }
    // if (type === "cancelled") {
    this.bookingService.getUserBookingCancelled().subscribe((apiRes: apiResultFormat) => {
      this.totalData = apiRes.totalData;
      this.bookingData.cancelledList = apiRes.data;
    });
    // }
  }

  viewBooking(type: any) {
    let params = {
      activeTab: type
    }
    this.router.navigate(['/user/booking'], {
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

  viewUsers(type: any) {
    let params = {
      activeTab: type
    }
    this.router.navigate(['/user/alluser'], {
      queryParams: params,
    });
  }

  onViewRefundStatus(item: any) {
    const modalRef = this.modalService.open(RefundStatusModalComponent, {
    });
    modalRef.componentInstance.title = "Your Refund request has been rejected by Car Owner";
    modalRef.componentInstance.bookingDetails = item;
    modalRef.result.then((res: any) => {
    }, () => {
    });
  }

  onView(item: any) {
    const modalRef = this.modalService.open(BookingStatusModalComponent, {
      size: 'lg'
    });
    modalRef.componentInstance.bookingDetails = item;
    modalRef.result.then((res: any) => {
    }, () => {
    });
  }

  goWallet() {
    this.router.navigate(['/user/wallet']);
  }
  goTransactions() {
    this.router.navigate(['/user/payments']);
  }
  goWishlist() {
    this.router.navigate(['/user/favourite']);
  }

  getTabValue(value: string) {
    this.activeTab = value;
  }

  pageChanged(event: any) {
    this.currentPage = event;
  }
}
