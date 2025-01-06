import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { Router } from '@angular/router';
import { UserApexchartsComponent } from '../../user-apexcharts/user-apexcharts.component';
import { GlobalService } from '../../../../../shared/services/global.service';

@Component({
  selector: 'app-doc-vehicle-book-details',
  standalone: true,
  imports: [
    CommonModule,
    CarouselModule
  ],
  templateUrl: './doc-vehicle-book-details.component.html',
  styleUrls: ['./doc-vehicle-book-details.component.scss']
})
export class DocVehicleBookDetailsComponent {

  performanceGrade: any = [44];

  bookingDetails: any = {
    totalUpcoming: 14,
    totalInprogress: 1,
    totalCompleted: 152,
    totalCancelled: 29,
  }
  infoObj: any = {
    "title": "Total Booking",
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
    //   "title": "Total Booking",
    //   "total": 800,
    //   "bg-color": "color-emerald-green",
    // },
    {
      "title": "Trip Booking for the Day",
      "total": 25,
      "bg-color": "color-sunset-orange",
    },
    {
      "title": "Trip Booking in last 1 Week",
      "total": 140,
      "bg-color": "color-red",
    },
    {
      "title": "Trip Booking in last 1 Month",
      "total": 600,
      "bg-color": "color-amber",
    },
    {
      "title": "Trip Booking in last 3 Month",
      "total": 900,
      "bg-color": "color-turquoise-blue",
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

      this.infoObj.data.chartLabels.push(item.title + ' - (' + item.total + ')')
      this.infoObj.data.series.push(parseInt(item.total))
      return {
        ...item,
        percentage: pr // percentage with 2 decimal places
      };
    });

    this.carOwnersData = carOwnersDataWithPercentage;
  }



  viewMyVehicles(type: any) {
    let params = {
      activeTab: type
    }
    this.router.navigate(['/user/my-cars'], {
      queryParams: params,
    });
  }
}
