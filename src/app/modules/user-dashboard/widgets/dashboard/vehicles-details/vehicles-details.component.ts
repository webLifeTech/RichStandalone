import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { Router } from '@angular/router';
import { UserApexchartsComponent } from '../../user-apexcharts/user-apexcharts.component';
import { GlobalService } from '../../../../../shared/services/global.service';

@Component({
  selector: 'app-vehicles-details',
  standalone: true,
  imports: [
    UserApexchartsComponent,

    CommonModule,
    CarouselModule
  ],
  templateUrl: './vehicles-details.component.html',
  styleUrls: ['./vehicles-details.component.scss']
})
export class VehiclesDetailsComponent {

  @Input() details: any = {};

  totalDrivers: any = {
    "title": "Total",
    "total": 0,
    "bg-color": "color-electric-purple",
    "data": {
      "series": [],
      "chartLabels": [],
      "chartColors": ["#dcc7fa", "#8e33ff"],
    }
  };



  constructor(
    public gs: GlobalService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    console.log("details >>>>", this.details);
    this.totalDrivers.total = this.details.totalVehicles;
    const carOwnersData: any = [
      {
        "title": "Active",
        "total": this.details.active,
        "bg-color": "color-emerald-green",
      },
      {
        "title": "Inactive",
        "total": this.details.inActive,
        "bg-color": "color-sunset-orange",
      },
      {
        "title": "Pending",
        "total": this.details.pending,
        "bg-color": "color-sunset-orange",
      },
      {
        "title": "KYC Pending",
        "total": this.details.KycPending,
        "bg-color": "color-red",
      },
      {
        "title": "Booked",
        "total": this.details.booked,
        "bg-color": "color-amber",
      },
      {
        "title": "Availble",
        "total": this.details.available,
        "bg-color": "color-turquoise-blue",
      },
    ];
    // for
    // Calculate the total value
    const totalValue = carOwnersData.reduce((sum: any, item: any) => sum + item.total, 0);

    // Add percentage key to each object
    const carOwnersDataWithPercentage = carOwnersData.map((item: any) => {
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



    // this.carOwnersData = carOwnersDataWithPercentage;


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
