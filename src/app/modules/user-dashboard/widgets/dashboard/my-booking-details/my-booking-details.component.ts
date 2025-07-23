import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { Router } from '@angular/router';
import { UserApexchartsComponent } from '../../user-apexcharts/user-apexcharts.component';
import { GlobalService } from '../../../../../shared/services/global.service';

@Component({
  selector: 'app-my-booking-details',
  standalone: true,
  imports: [
    UserApexchartsComponent,

    CommonModule,
    CarouselModule
  ],
  templateUrl: './my-booking-details.component.html',
  styleUrls: ['./my-booking-details.component.scss']
})
export class MyBookingDetailsComponent {


  performanceGrade: any = [44];

  bookingDetails: any = {
    totalUpcoming: 14,
    totalInprogress: 1,
    totalCompleted: 152,
    totalCancelled: 29,
  }

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
    {
      "title": "Total Booking",
      "total": 80,
      "bg-color": "color-emerald-green",
    },
    {
      "title": "Pending Request",
      "total": 10,
      "bg-color": "color-sunset-orange",
    },
    {
      "title": "Confirmed",
      "total": 9,
      "bg-color": "color-turquoise-blue",
    },
    {
      "title": "Start Service",
      "total": 1,
      "bg-color": "color-amber",
    },
    {
      "title": "End Service",
      "total": 70,
      "bg-color": "color-emerald-green",
    },
    {
      "title": "Cancelled",
      "total": 10,
      "bg-color": "color-red",
    },
  ];

  constructor(
    public gs: GlobalService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    // for
    // Calculate the total value
    const totalValue = this.carOwnersData.reduce((sum: any, item: any) => sum + item.total, 0);

    // Add percentage key to each object
    const carOwnersDataWithPercentage = this.carOwnersData.map((item: any) => {
      let pr: any = ((item.total / totalValue) * 100).toFixed(0);

      this.totalDrivers.data.chartLabels.push(item.title + ' - (' + item.total + ')')
      this.totalDrivers.data.series.push(parseInt(item.total))
      return {
        ...item,
        percentage: pr // percentage with 2 decimal places
      };
    });

    this.carOwnersData = carOwnersDataWithPercentage;


  }

  viewBooking(type: any) {
    let params = {
      activeTab: type
    }
    this.router.navigate(['/user/booking'], {
      queryParams: params,
    });
  }
}
