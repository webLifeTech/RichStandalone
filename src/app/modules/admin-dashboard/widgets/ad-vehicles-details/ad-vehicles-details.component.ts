import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalService } from '../../../../shared/services/global.service';
import { Router } from '@angular/router';
import { ApexchartsComponent } from '../apexcharts/apexcharts.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../../shared/services/admin.service';

@Component({
  selector: 'app-ad-vehicles-details',
  standalone: true,
  imports: [
    ApexchartsComponent,

    CommonModule,
    FormsModule,
    NgSelectModule,
  ],
  templateUrl: './ad-vehicles-details.component.html',
  styleUrls: ['./ad-vehicles-details.component.scss']
})
export class AdVehiclesDetailsComponent {

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
        this.data = JSON.parse(dashboardAllDetails.vehiclesOverView);
        this.setData();
      }
    });
  }

  setData() {
    this.carOwnersData = [
      {
        "title": "Active",
        "total": this.data.active,
        "bg-color": "color-emerald-green",
      },
      {
        "title": "Inactive",
        "total": this.data.inActive,
        "bg-color": "color-sunset-orange",
      },
      {
        "title": "KYC Pending",
        "total": this.data.KycPending,
        "bg-color": "color-red",
      },
    ];
    this.totalDrivers.total = this.data.totalVehicles;
    const totalValue = this.carOwnersData.reduce((sum: any, item: any) => sum + item.total, 0);
    this.totalDrivers.data.chartLabels = [];
    this.totalDrivers.data.series = [];
    const carOwnersDataWithPercentage = this.carOwnersData.map((item: any) => {
      let pr: any = ((item.total / totalValue) * 100).toFixed(0);
      this.totalDrivers.data.chartLabels.push(item.title + ' : ' + item.total)
      this.totalDrivers.data.series.push(parseInt(pr))
      return {
        ...item,
        percentage: pr
      };
    });
    this.carOwnersData = carOwnersDataWithPercentage;
    this.isDataLoading = false;
  }


  viewVehicles(type: any) {
    let params = {
      activeTab: type
    }
    this.router.navigate(['/user/allVehicles'], {
      queryParams: params,
    });
  }

  onChangeTime() {
    this.filterData();
  }
}
