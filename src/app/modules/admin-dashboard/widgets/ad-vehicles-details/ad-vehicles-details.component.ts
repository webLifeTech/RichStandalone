import { Component, Input } from '@angular/core';
import { brand } from '../../../../shared/interface/cab-modern';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { GlobalService } from '../../../../shared/services/global.service';
import { Router } from '@angular/router';
import { ApexchartsComponent } from '../apexcharts/apexcharts.component';

@Component({
  selector: 'app-ad-vehicles-details',
  standalone: true,
  imports: [
    ApexchartsComponent,

    CommonModule,
    CarouselModule
  ],
  templateUrl: './ad-vehicles-details.component.html',
  styleUrls: ['./ad-vehicles-details.component.scss']
})
export class AdVehiclesDetailsComponent {

  @Input() brand: brand[];

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
      "title": "Active",
      "total": 500,
      "bg-color": "color-emerald-green",
    },
    {
      "title": "Inactive",
      "total": 200,
      "bg-color": "color-sunset-orange",
    },
    {
      "title": "KYC Pending",
      "total": 300,
      "bg-color": "color-red",
    },
    // {
    //   "title": "Booked",
    //   "total": 300,
    //   "bg-color": "color-amber",
    // },
    // {
    //   "title": "Availble",
    //   "total": 700,
    //   "bg-color": "color-turquoise-blue",
    // },
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

      this.totalDrivers.data.chartLabels.push(item.title + ' : ' + item.total)
      // if (!item.data.percentage) {
      //   item.data.percentage = parseInt(pr);
      // }
      this.totalDrivers.data.series.push(parseInt(pr))
      return {
        ...item,
        percentage: pr // percentage with 2 decimal places
      };
    });



    this.carOwnersData = carOwnersDataWithPercentage;


  }

  viewVehicles(type: any) {
    let params = {
      activeTab: type
    }
    this.router.navigate(['/user/allVehicles'], {
      queryParams: params,
    });
  }
}
