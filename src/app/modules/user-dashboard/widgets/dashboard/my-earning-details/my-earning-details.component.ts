import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GlobalService } from '../../../../../shared/services/global.service';
import { CurrencySymbolPipe } from '../../../../../shared/pipe/currency.pipe';

@Component({
  selector: 'app-my-earning-details',
  standalone: true,
  imports: [

    CommonModule,
    CurrencySymbolPipe
  ],
  templateUrl: './my-earning-details.component.html',
  styleUrls: ['./my-earning-details.component.scss']
})
export class MyEarningDetailsComponent {


  performanceGrade: any = [44];

  bookingDetails: any = {
    totalUpcoming: 14,
    totalInprogress: 1,
    totalCompleted: 152,
    totalCancelled: 29,
  }

  totalDrivers: any = {
    "title": "Total Transaction",
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
    //   "title": "Active",
    //   "total": 800,
    //   "bg-color": "color-emerald-green",
    // },
    {
      "title": "Transaction for the Day",
      "total": 100,
      "bg-color": "color-sunset-orange",
    },
    {
      "title": "Transaction for the last 1 week",
      "total": 800,
      "bg-color": "color-red",
    },
    {
      "title": "Transaction for the last 1 month",
      "total": 3200,
      "bg-color": "color-amber",
    },
    {
      "title": "Transaction for the last 3 month",
      "total": 9600,
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

      this.totalDrivers.data.chartLabels.push(item.title)
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
