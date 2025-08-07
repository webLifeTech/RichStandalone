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
import { CarBookingOverviewComponent } from './widgets/dashboard/car-booking-overview/car-booking-overview.component';
import { DriverBookingOverviewComponent } from './widgets/dashboard/driver-booking-overview/driver-booking-overview.component';
import { ProfileService } from '../../shared/services/profile.service';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [
    CarBookingOverviewComponent,
    DriverBookingOverviewComponent,

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
  public pageSize = 10;
  public totalData = 0;
  public currentPage = 1;

  sortColumn: any = "vin";
  sortOrder: any = "DESC";
  dashboardAllDetails: any = {};


  sectionInfo: any = {}

  dashboardDataArray: any = [];

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

  constructor(
    private pageService: PagesService,
    public gs: GlobalService,
    private bookingService: BookingService,
    private router: Router,
    private modalService: NgbModal,
    public profileService: ProfileService,
  ) {
    // this.getTableData();
    this.getUserDashboardDetails();
  }

  getUserDashboardDetails() {
    const body = {
      userId: this.gs.loggedInUserInfo.userId,
    }
    this.gs.isSpinnerShow = true;
    this.gs.GetUserDashboardDetails(body).subscribe(async (response: any) => {
      if (response && response.statusCode == "200") {
        this.dashboardAllDetails = JSON.parse(response.userDashboardDetails);
        console.log("response >>>", this.dashboardAllDetails);
        if (this.dashboardAllDetails?.driverRiskDetails) {
          this.dashboardAllDetails.driverRiskDetails = JSON.parse(this.dashboardAllDetails.driverRiskDetails);
        }
        if (this.dashboardAllDetails?.myBookingOverView) {
          this.dashboardAllDetails.myBookingOverView = JSON.parse(this.dashboardAllDetails.myBookingOverView);
        }
        if (this.dashboardAllDetails?.myTripsBookingOverView) {
          this.dashboardAllDetails.myTripsBookingOverView = JSON.parse(this.dashboardAllDetails.myTripsBookingOverView);
        }
        if (this.dashboardAllDetails?.myDriverBookingOverView) {
          this.dashboardAllDetails.myDriverBookingOverView = JSON.parse(this.dashboardAllDetails.myDriverBookingOverView);
        }
        if (this.dashboardAllDetails?.myDriverTripsBookingOverView) {
          this.dashboardAllDetails.myDriverTripsBookingOverView = JSON.parse(this.dashboardAllDetails.myDriverTripsBookingOverView);
        }
        if (this.dashboardAllDetails?.myVehicleBookingOverView) {
          this.dashboardAllDetails.myVehicleBookingOverView = JSON.parse(this.dashboardAllDetails.myVehicleBookingOverView);
        }
        if (this.dashboardAllDetails?.myVehicleTripsBookingOverView) {
          this.dashboardAllDetails.myVehicleTripsBookingOverView = JSON.parse(this.dashboardAllDetails.myVehicleTripsBookingOverView);
        }
        if (this.dashboardAllDetails?.vehicleOverView) {
          this.dashboardAllDetails.vehicleOverView = JSON.parse(this.dashboardAllDetails.vehicleOverView);
        }

        this.dashboardAllDetails.totalFavourite = this.dashboardAllDetails.favouriteCars + this.dashboardAllDetails.favouriteDrivers;

        if (this.dashboardAllDetails?.driverRiskDetails) {
          this.dashboardAllDetails.averageStartRating = this.dashboardAllDetails.driverRiskDetails.customerAverageStarRating;
          this.dashboardAllDetails.driverRiskScore = {
            "series": [parseFloat(this.dashboardAllDetails.driverRiskDetails.riskScorePercentage)],
            "chartLabel": this.dashboardAllDetails.driverRiskDetails.riskScorePercentage,
            "chartColors": ["#22c55e", "#77ed8b"],
          };
        }
      }

      let tempArray: any = [];

      if (this.gs.loggedInUserInfo['role'] === 'user') {
        // myTripsBookingOverView
        this.dashboardAllDetails.myTripsBookingOverView.title = "Bookings by Car Owner";
        this.dashboardAllDetails.myTripsBookingOverView.isDriverBookingOverviewShow = true;
        tempArray.push(this.dashboardAllDetails.myTripsBookingOverView);

        // myBookingOverView
        this.dashboardAllDetails.myBookingOverView.title = "My Bookings";
        this.dashboardAllDetails.myBookingOverView.isCarBookingOverviewShow = true;
        this.dashboardAllDetails.myBookingOverView.view = true;
        this.dashboardAllDetails.myBookingOverView.route = '/user/booking';
        tempArray.push(this.dashboardAllDetails.myBookingOverView);
      }

      if (this.gs.loggedInUserInfo['role'] === 'user_2' || this.gs.loggedInUserInfo['role'] === 'user_3') {
        // myBookingOverView
        this.dashboardAllDetails.myBookingOverView.title = "Driver Assigned by Me";
        this.dashboardAllDetails.myBookingOverView.isDriverBookingOverviewShow = true;
        tempArray.push(this.dashboardAllDetails.myBookingOverView);

        // myTripsBookingOverView
        this.dashboardAllDetails.myTripsBookingOverView.title = "Bookings by Driver";
        this.dashboardAllDetails.myTripsBookingOverView.isCarBookingOverviewShow = true;
        this.dashboardAllDetails.myTripsBookingOverView.view = true;
        this.dashboardAllDetails.myTripsBookingOverView.route = '/user/booking';
        tempArray.push(this.dashboardAllDetails.myTripsBookingOverView);
      }

      if (this.gs.loggedInUserInfo['role'] === 'user_4') {
        // myDriverBookingOverView
        this.dashboardAllDetails.myDriverBookingOverView.title = "Driver Assigned by Me";
        this.dashboardAllDetails.myDriverBookingOverView.isDriverBookingOverviewShow = true;
        tempArray.push(this.dashboardAllDetails.myDriverBookingOverView);

        // myVehicleBookingOverView
        this.dashboardAllDetails.myVehicleBookingOverView.title = "My Bookings";
        this.dashboardAllDetails.myVehicleBookingOverView.isCarBookingOverviewShow = true;
        this.dashboardAllDetails.myVehicleBookingOverView.route = '/user/booking';
        tempArray.push(this.dashboardAllDetails.myVehicleBookingOverView);

        // myDriverTripsBookingOverView
        this.dashboardAllDetails.myDriverTripsBookingOverView.title = "Bookings by Car Owner";
        this.dashboardAllDetails.myDriverTripsBookingOverView.isDriverBookingOverviewShow = true;
        tempArray.push(this.dashboardAllDetails.myDriverTripsBookingOverView);

        // myVehicleTripsBookingOverView
        this.dashboardAllDetails.myVehicleTripsBookingOverView.title = "Bookings by Driver";
        this.dashboardAllDetails.myVehicleTripsBookingOverView.isCarBookingOverviewShow = true;
        this.dashboardAllDetails.myVehicleTripsBookingOverView.route = '/user/booking';
        tempArray.push(this.dashboardAllDetails.myVehicleTripsBookingOverView);
      }


      let newArray: any = [];
      for (let i in tempArray) {
        let data = [{
          "title": "Pending Request",
          "total": tempArray[i].pendingRequest,
          "bg-color": "color-sunset-orange",
        },
        {
          "title": "Confirmed",
          "total": tempArray[i].confirmed,
          "bg-color": "color-turquoise-blue",
        },
        {
          "title": "Start Service",
          "total": tempArray[i].startService,
          "bg-color": "color-amber",
        },
        {
          "title": "End Service",
          "total": tempArray[i].endService,
          "bg-color": "color-emerald-green",
        },
        {
          "title": "Cancelled",
          "total": tempArray[i].cancelled,
          "bg-color": "color-red",
        },
        ]

        if (tempArray[i].isDriverBookingOverviewShow) {
          data.unshift({
            "title": "Total Booking",
            "total": tempArray[i].totalBookings,
            "bg-color": "color-emerald-green",
          });
        }

        newArray.push(
          {
            title: tempArray[i].title,
            isCarBookingOverviewShow: tempArray[i].isCarBookingOverviewShow || false,
            isDriverBookingOverviewShow: tempArray[i].isDriverBookingOverviewShow || false,
            isDataLoaded: true, // need to do - false
            view: tempArray[i].view || false,
            route: tempArray[i].route,
            countType: tempArray[i].countType,
            totalBooked: {
              "title": "Total",
              "total": tempArray[i].totalBookings,
              "bg-color": "color-electric-purple",
              "data": {
                "series": [],
                "chartLabels": [],
                "chartColors": ["#dcc7fa", "#8e33ff"],
              }
            },
            bookedData: tempArray[i].totalBookings ? data : []
          }
        )
      }
      console.log("newArray >>>>", newArray);

      if (this.gs.loggedInUserInfo['role'] === 'user_2' || this.gs.loggedInUserInfo['role'] === 'user_3' || this.gs.loggedInUserInfo['role'] === 'user_4') {
        // if (this.dashboardAllDetails?.vehicleRiskRatings && this.dashboardAllDetails?.vehicleRiskRatings?.length) {
        let vehicleRiskScore: any = [];
        let vehicleStarRating: any = [];
        const maxShowDataInGrid = "3";
        for (let i in this.dashboardAllDetails.vehicleRiskRatings) {
          if (maxShowDataInGrid > i) {
            vehicleRiskScore.push({
              "title": this.dashboardAllDetails.vehicleRiskRatings[i].vin + '\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0' + this.dashboardAllDetails.vehicleRiskRatings[i].Make + '-' + this.dashboardAllDetails.vehicleRiskRatings[i].Modelyear,
              "total": parseFloat(this.dashboardAllDetails.vehicleRiskRatings[i].riskScorePercentage) || 0,
              "bg-color": "color-sunset-orange",
            })
            vehicleStarRating.push({
              "title": this.dashboardAllDetails.vehicleRiskRatings[i].vin + '\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0' + this.dashboardAllDetails.vehicleRiskRatings[i].Make + '-' + this.dashboardAllDetails.vehicleRiskRatings[i].Modelyear,
              "total": parseFloat(this.dashboardAllDetails.vehicleRiskRatings[i].customerAverageStarRating) || 0,
            })
          }
        }

        newArray.push(
          {
            title: "Vehicle Risk Assessment",
            isCarBookingOverviewShow: true,
            view: this.dashboardAllDetails?.vehicleRiskRatings?.length >= maxShowDataInGrid ? true : false,
            route: "/user/vehicle-risk-rating",
            countType: "percentage",
            totalBooked: null,
            bookedData: vehicleRiskScore
          },
          {
            title: "Overall Vehicle Rating",
            isCarBookingOverviewShow: true,
            view: this.dashboardAllDetails?.vehicleRiskRatings?.length >= maxShowDataInGrid ? true : false,
            route: "/user/vehicle-risk-rating",
            countType: "star",
            totalBooked: null,
            bookedData: vehicleStarRating
          },
        )
      }
      this.dashboardDataArray = newArray;
      this.gs.isSpinnerShow = false;
    })
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
