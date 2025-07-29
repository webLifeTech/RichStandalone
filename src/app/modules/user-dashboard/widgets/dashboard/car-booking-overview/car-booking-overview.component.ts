import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { Router } from '@angular/router';
import { GlobalService } from '../../../../../shared/services/global.service';
import { CurrencySymbolPipe } from '../../../../../shared/pipe/currency.pipe';
import { BarRating } from 'ngx-bar-rating';

@Component({
  selector: 'app-car-booking-overview',
  standalone: true,
  imports: [
    CommonModule,
    CarouselModule,
    BarRating
  ],
  templateUrl: './car-booking-overview.component.html',
  styleUrls: ['./car-booking-overview.component.scss']
})
export class CarBookingOverviewComponent {

  @Input() details: any = {
    totalBooked: {},
    bookedData: []
  };

  performanceGrade: any = [44];

  bookingDetails: any = {
    totalUpcoming: 14,
    totalInprogress: 1,
    totalCompleted: 152,
    totalCancelled: 29,
  }

  // infoObj: any = {
  //   "title": "Total Booking",
  //   "total": 1000,
  //   "bg-color": "color-electric-purple",
  //   "data": {
  //     "series": [],
  //     "chartLabels": [],
  //     "chartColors": ["#dcc7fa", "#8e33ff"],
  //   }
  // };

  // carOwnersData: any = [
  //   {
  //     "title": "Pending Request",
  //     "total": 140,
  //     "bg-color": "color-sunset-orange",
  //   },
  //   {
  //     "title": "Confirmed",
  //     "total": 125,
  //     "bg-color": "color-turquoise-blue",
  //   },
  //   {
  //     "title": "Start Service",
  //     "total": 275,
  //     "bg-color": "color-amber",
  //   },
  //   {
  //     "title": "End Service",
  //     "total": 200,
  //     "bg-color": "color-emerald-green",
  //   },
  //   {
  //     "title": "Cancelled",
  //     "total": 50,
  //     "bg-color": "color-red",
  //   },
  // ];

  constructor(
    public gs: GlobalService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    // for
    // Calculate the total value
    if (this.details.bookedData.length) {
      if (this.details.totalBooked) {
        const totalValue = this.details.bookedData.reduce((sum: any, item: any) => sum + item.total, 0);

        // Add percentage key to each object
        const carOwnersDataWithPercentage = this.details.bookedData.map((item: any) => {
          let pr: any = ((item.total / totalValue) * 100).toFixed(0);

          this.details.totalBooked.data.chartLabels.push(item.title + ' - (' + item.total + ')')
          this.details.totalBooked.data.series.push(parseInt(item.total))
          return {
            ...item,
            percentage: pr // percentage with 2 decimal places
          };
        });

        this.details.bookedData = carOwnersDataWithPercentage;
      } else {
        const carOwnersDataWithPercentage = this.details.bookedData.map((item: any) => {
          return {
            ...item,
            percentage: item.total // percentage with 2 decimal places
          };
        })
        this.details.bookedData = carOwnersDataWithPercentage;
      }
    }
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
