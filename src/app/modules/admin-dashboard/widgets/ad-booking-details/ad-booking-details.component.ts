import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GlobalService } from '../../../../shared/services/global.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../../shared/services/admin.service';

@Component({
  selector: 'app-ad-booking-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
  ],
  templateUrl: './ad-booking-details.component.html',
  styleUrls: ['./ad-booking-details.component.scss']
})
export class AdBookingDetailsComponent {
  @Input() data: any = {};
  @Input() timeTypeList: any = [];

  totalDrivers: any = {
    "title": "Total",
    "total": 1000,
    "bg-color": "color-electric-purple",
    "data": {
      "series": [],
      "chartLabels": [],
      "chartColors": ["#dcc7fa", "#8e33ff"],
    }
  };

  carOwnersData: any = [];
  timeType: any = "All Time";
  isDataLoading: any = false;

  constructor(
    public gs: GlobalService,
    private router: Router,
    private adminService: AdminService,
  ) { }

  ngOnInit() {
    this.setData();
  }

  filterData() {
    this.gs.isSpinnerShow = true;
    this.isDataLoading = true;
    const body = {
      filter: this.timeType
    }
    this.adminService.GetAdminDashboardDetails(body).subscribe((response: any) => {
      this.gs.isSpinnerShow = false;
      if (response && response.statusCode == "200") {
        const dashboardAllDetails = JSON.parse(response.userDashboardDetails);
        this.data = JSON.parse(dashboardAllDetails.bookingOverview);
        this.setData();
      }
    });
  }

  setData() {
    this.carOwnersData = [
      {
        "title": "Total Vehicle Booked",
        "total": this.data.totalBookedVehicles,
        "bg-color": "color-turquoise-blue",
      },
      {
        "title": "Vehicle Booking Inprogres",
        "total": this.data.vehicleBookingInprogress,
        "bg-color": "color-amber",
      },
      {
        "title": "Vehicle Trip Completed",
        "total": this.data.vehicleTripCompleted,
        "bg-color": "color-emerald-green",
      },
      {
        "title": "Vehicle Trip Cancelled",
        "total": this.data.vehicleTripCancelled,
        "bg-color": "color-red",
      },
      {
        "title": "Total Driver Booked",
        "total": this.data.totalBookedDrivers,
        "bg-color": "color-turquoise-blue",
      },
      {
        "title": "Driver Booking InProgress",
        "total": this.data.driverBookingInprogress,
        "bg-color": "color-amber",
      },
      {
        "title": "Driver Trip completed",
        "total": this.data.driverTripCompleted,
        "bg-color": "color-emerald-green",
      },
      {
        "title": "Driver Trip Cancelled",
        "total": this.data.driverTripCancelled,
        "bg-color": "color-red",
      },
    ];

    const totalValue = this.carOwnersData.reduce((sum: any, item: any) => sum + item.total, 0);
    const carOwnersDataWithPercentage = this.carOwnersData.map((item: any) => {
      let pr: any = ((item.total / totalValue) * 100).toFixed(0);
      this.totalDrivers.data.chartLabels.push(item.title + ' - (' + item.total + ')')
      this.totalDrivers.data.series.push(parseInt(item.total))
      return {
        ...item,
        percentage: pr
      };
    });
    this.carOwnersData = carOwnersDataWithPercentage;
  }

  viewBooking(type: any) {
    let params = {
      activeTab: type
    }
    this.router.navigate(['/user/bookingOverview'], {
      queryParams: params,
    });
  }

  onChangeTime() {
    this.filterData();
  }
}
