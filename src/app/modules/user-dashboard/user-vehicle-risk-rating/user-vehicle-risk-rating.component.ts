import { Component, Input } from '@angular/core';
import { CabService } from '../../../shared/services/cab.service';
import { MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { apiResultFormat, userBookings } from '../../../shared/services/model/model';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { GlobalService } from '../../../shared/services/global.service';
import { ReviewService } from '../../../shared/services/review.service';
import { RolePermissionService } from '../../../shared/services/rolepermission.service';
import { SortDirective } from '../../../shared/directives/sort.directive';
import { NgSelectModule } from '@ng-select/ng-select';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { BarRating } from 'ngx-bar-rating';

@Component({
  selector: 'app-user-vehicle-risk-rating',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    NgxPaginationModule,
    MatMenuModule,
    MatButtonModule,
    NgSelectModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    BarRating
  ],
  templateUrl: './user-vehicle-risk-rating.component.html',
  styleUrl: './user-vehicle-risk-rating.component.scss'
})
export class UserVehicleRiskRatingComponent {

  public searchDataValue = '';
  public pageSize = 10;
  public totalData = 0;
  public currentPage = 1;
  public totalPages = 0;
  public tableData: any = [];
  public vehicleRiskRatings: any = [];
  sortColumn: any = "vin";
  sortOrder: any = "DESC";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reviewService: ReviewService,
    public getPer: RolePermissionService,
    public cabService: CabService,
    public gs: GlobalService,

  ) {
    this.route.queryParams.subscribe((params) => {
      this.getTableData();
    })
  }

  getTableData() {
    // this.reviewService.getUserActivities().subscribe((apiRes: apiResultFormat) => {
    //   this.totalData = apiRes.totalData;
    //   this.tableData = apiRes.data;
    // });
    const body = {
      userId: this.gs.loggedInUserInfo.userId,
    }
    this.gs.isSpinnerShow = true;
    this.gs.GetUserDashboardDetails(body).subscribe(async (response: any) => {
      this.gs.isSpinnerShow = false;
      if (response && response.statusCode == "200") {
        const dashboardAllDetails = JSON.parse(response.userDashboardDetails);
        this.totalData = dashboardAllDetails?.vehicleRiskRatings?.length || 0;
        this.tableData = dashboardAllDetails?.vehicleRiskRatings;
        this.vehicleRiskRatings = dashboardAllDetails?.vehicleRiskRatings;
        console.log("dashboardAllDetails >>>", dashboardAllDetails);
      }
    })
  }

  pageChanged(event: any) {
    this.currentPage = event;
  }

  onSort(column: any) {
    this.sortColumn = column;
    this.sortOrder = this.sortOrder === "DESC" ? "ASC" : "DESC";
    this.getTableData();
  }

  onChange() {
  }

  back() {
    this.router.navigateByUrl('/user/dashboard')
  }

  searchData() {
    const term = this.searchDataValue.trim().toLowerCase();

    if (!term) {
      this.tableData = [...this.vehicleRiskRatings];
      return;
    }

    this.tableData = this.vehicleRiskRatings.filter((vehicle: any) =>
      vehicle.vin.toLowerCase().includes(term) ||
      vehicle.Make.toLowerCase().includes(term) ||
      vehicle.Model.toLowerCase().includes(term) ||
      vehicle.Modelyear.toString().includes(term)
    );
  }

  filteredVehicles() {
    if (!this.searchDataValue) {
      return this.tableData;
    }

    const lowerSearch = this.searchDataValue.toLowerCase();

    return this.tableData.filter((vehicle: any) =>
      vehicle.vin.toLowerCase().includes(lowerSearch) ||
      vehicle.Make.toLowerCase().includes(lowerSearch) ||
      vehicle.Model.toLowerCase().includes(lowerSearch) ||
      vehicle.Modelyear.toString().includes(lowerSearch)
    );
  }
}
