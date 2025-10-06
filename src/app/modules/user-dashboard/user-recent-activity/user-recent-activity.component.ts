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
  filterObj: any = {
    sortFilter: "Last 30 Days"
  };
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
    this.onChange();
  }

  getTableData() {

    const startDate = this.filterObj.dateTimeRange ? this.filterObj.dateTimeRange[0] : null// this.transformDate(this.filterObj.dateTimeRange[0], 'MM/dd/yy') : null;
    const endDate = this.filterObj.dateTimeRange ? this.filterObj.dateTimeRange[1] : null// this.transformDate(this.filterObj.dateTimeRange[1], 'MM/dd/yy') : null;

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
    }, (error: any) => {
      this.gs.isSpinnerShow = false;
    })
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
    if (this.filterObj.sortFilter != 'Custom Date') {
      this.filterObj.dateTimeRange = {};
      this.filterObj.dateTimeRange[1] = new Date();
    }
    if (this.filterObj.sortFilter == 'This Week') {
      const Date = this.gs.getThisWeekRange();
      console.log("Date >>>>>", Date);
      this.filterObj.dateTimeRange[0] = Date.startDate;
    }
    if (this.filterObj.sortFilter == 'This Month') {
      const Date = this.gs.getThisMonthRange();
      this.filterObj.dateTimeRange[0] = Date.startDate;
    }
    if (this.filterObj.sortFilter == 'Last 30 Days') {
      const Date = this.gs.getLast30DaysRange();
      this.filterObj.dateTimeRange[0] = Date.startDate;
    }
    this.getTableData();
  }

  transformDate(date: any, format: any) {
    return this.datePipe.transform(date, format);
  }

  exportToExcel() {
    console.log("this.filterObj.dateTimeRange >>>>>>>", this.filterObj.dateTimeRange);

    const startDate = this.filterObj.dateTimeRange ? this.filterObj.dateTimeRange[0] : null
    const endDate = this.filterObj.dateTimeRange ? this.filterObj.dateTimeRange[1] : null

    const body = {
      "userId": this.gs.loggedInUserInfo.userId,
      "pageNumber": 1,
      "pagesize": this.totalData,
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
        let tableData = response.userActivityLog;
        let finalData: any = [];
        const style = {
          border: {
            top: { style: "medium" },
            left: { style: "medium" },
            bottom: { style: "medium" },
            right: { style: "medium" }
          },
          alignment: { vertical: 'middle', horizontal: 'left', wrapText: true }
        }
        for (let i in tableData) {
          finalData.push({
            "SL": {
              ...style,
              value: Number(i) + 1,
            },
            "Activity ID": {
              ...style,
              value: tableData[i].activityId || '-',
            },
            "Description": {
              ...style,
              value: tableData[i].summary || '-',
            },
            "Date": {
              ...style,
              value: tableData[i].timestamp || '-',
            },
          });
        }
        let title = "My Activities";
        if (startDate) {
          title = title + ' - ' + this.transformDate(this.filterObj.dateTimeRange[0], 'MM/dd/yyyy') + ' To ' + this.transformDate(this.filterObj.dateTimeRange[1], 'MM/dd/yyyy');
        }

        this.gs.exportToExcelCustom(finalData, "MyActivities", title);
      }
    })
  }
}
