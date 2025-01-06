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
      "title": "Today Vehicle Booked",
      "total": 800,
      "bg-color": "color-emerald-green",
    },
    {
      "title": "Vehicle Booking Inprogres",
      "total": 140,
      "bg-color": "color-sunset-orange",
    },
    {
      "title": "Vehicle Trip Completed",
      "total": 325,
      "bg-color": "color-red",
    },
    {
      "title": "Today Driver Booked",
      "total": 600,
      "bg-color": "color-amber",
    },
    {
      "title": "Today Driver Booking InProgress",
      "total": 135,
      "bg-color": "color-turquoise-blue",
    },
    {
      "title": "Today Driver Trip completed",
      "total": 335,
      "bg-color": "color-electric-purple",
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
    this.router.navigate(['/admin/booking-overview'], {
      queryParams: params,
    });
  }
}
