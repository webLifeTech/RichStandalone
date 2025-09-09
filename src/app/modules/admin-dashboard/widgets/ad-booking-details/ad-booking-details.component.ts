import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { Router } from '@angular/router';
import { ApexchartsComponent } from '../apexcharts/apexcharts.component';
import { GlobalService } from '../../../../shared/services/global.service';

@Component({
  selector: 'app-ad-booking-details',
  standalone: true,
  imports: [
    CommonModule,
    CarouselModule
  ],
  templateUrl: './ad-booking-details.component.html',
  styleUrls: ['./ad-booking-details.component.scss']
})
export class AdBookingDetailsComponent {
  @Input() data: any = {};
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

  carOwnersData: any = [
    // {
    //   "title": "Today Vehicle Booked",
    //   "total": 800,
    //   "bg-color": "color-emerald-green",
    // },
    // {
    //   "title": "Vehicle Booking Inprogres",
    //   "total": 140,
    //   "bg-color": "color-sunset-orange",
    // },
    // {
    //   "title": "Vehicle Trip Completed",
    //   "total": 325,
    //   "bg-color": "color-red",
    // },
    // {
    //   "title": "Today Driver Booked",
    //   "total": 600,
    //   "bg-color": "color-amber",
    // },
    // {
    //   "title": "Today Driver Booking InProgress",
    //   "total": 135,
    //   "bg-color": "color-turquoise-blue",
    // },
    // {
    //   "title": "Today Driver Trip completed",
    //   "total": 335,
    //   "bg-color": "color-electric-purple",
    // },
  ];

  constructor(
    public gs: GlobalService,
    private router: Router,
  ) { }

  ngOnInit() {
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
}
