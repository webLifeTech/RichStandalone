import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { GlobalService } from '../../../shared/services/global.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';

@Component({
  selector: 'app-user-recent-activity',
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
  ],
  providers: [DatePipe],
  templateUrl: './user-recent-activity.component.html',
  styleUrl: './user-recent-activity.component.scss'
})
export class UserRecentActivityComponent {

  public searchDataValue = '';
  public pageSize = 10;
  public totalData = 0;
  public currentPage = 1;
  public totalPages = 0;
  public tableData: any = [];
  filterObj: any = {};
  sortFilter: any = [
    { value: "This Week" },
    { value: "This Month" },
    { value: "Last 30 Days" },
    { value: "Custom Date" },
  ]
  sortColumn: any = "activityId";
  sortOrder: any = "DESC";

  constructor(
    private datePipe: DatePipe,
    public gs: GlobalService,
  ) {
    this.getTableData();
  }

  getTableData() {

    const startDate = this.filterObj.dateTimeRange ? this.transformDate(this.filterObj.dateTimeRange[0], 'MM/dd/yy') : null;
    const endDate = this.filterObj.dateTimeRange ? this.transformDate(this.filterObj.dateTimeRange[1], 'MM/dd/yy') : null;

    const body = {
      "userId": this.gs.loggedInUserInfo.userId,
      "pageNumber": this.currentPage,
      "pagesize": this.pageSize,
      "globalSearch": this.searchDataValue?.trim() || "",
      "sortColumn": this.sortColumn,
      "sortOrder": this.sortOrder,
      "startDate": startDate,
      "endDate": endDate,
    }
    this.gs.isSpinnerShow = true;
    this.gs.GetUserActivityLogs(body).subscribe(async (response: any) => {
      console.log("response >>>", response);
      this.gs.isSpinnerShow = false;
      if (response && response.responseResultDtos && response.responseResultDtos.statusCode == "200") {
        this.tableData = response.userActivityLog;
        console.log("this.totalData >>>", this.totalData);
        this.totalData = response.viewModel.totalCount;
      }
    })
    // this.reviewService.getUserActivities().subscribe((apiRes: any) => {
    // });
  }

  pageChanged(event: any) {
    this.currentPage = event;
    this.getTableData();
  }

  onSort(column: any) {
    this.sortColumn = column;
    this.sortOrder = this.sortOrder === "DESC" ? "ASC" : "DESC";
    this.getTableData();
  }

  searchData() {
    this.currentPage = 1;
    this.getTableData();
  }

  onChange() {
    console.log("filterObj >>>", this.filterObj);
    this.getTableData();
  }

  transformDate(date: any, format: any) {
    return this.datePipe.transform(date, format);
  }
}
