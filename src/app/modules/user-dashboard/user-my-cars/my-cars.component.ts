import { Component, Input } from '@angular/core';
import { CabService } from '../../../shared/services/cab.service';
import { CommonModule, DatePipe } from '@angular/common';
import { CurrencySymbolPipe } from '../../../shared/pipe/currency.pipe';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { ToastService } from '../../../shared/services/toast.service';
import { GlobalService } from '../../../shared/services/global.service';
import { ChangeCarPriceModalComponent } from '../../../shared/components/comman/modal/my-car-modals/change-car-price-modal/change-car-price-modal.component';
import { ProfileService } from '../../../shared/services/profile.service';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';

@Component({
  selector: 'app-my-cars',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    NgbModule,
    NgxPaginationModule,
    MatMenuModule,
    MatButtonModule,
    CurrencySymbolPipe,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
  ],
  providers: [DatePipe],
  templateUrl: './my-cars.component.html',
  styleUrl: './my-cars.component.scss'
})
export class MyCarsComponent {
  public tableData: any = [];
  sortColumn: any = "vin";
  sortOrder: any = "DESC";
  pageSize: any = 10;
  currentPage: any = 1;
  totalData: any = 0;
  dateTimeRange: any = "";

  public searchFilter: any = {
    branch: 'all',
    status: 'all',
    globalSearch: ''
  };
  public activeTab = 'All Cars';
  activeTabName: any = '';
  total_booking_amount: any = 1200;
  total_refunded_amount: any = 200;
  total_net_profit: any = 1000;
  editInfo: any = {};
  booktabs: any = [];

  vehicleStatusList: any = [
    { id: 1, name: 'All Status', value: 'all' },
    { id: 1, name: 'Active', value: 'Active' },
    { id: 2, name: 'Inactive', value: 'Inactive' },
    { id: 3, name: 'Repair', value: 'Repair' },
  ]

  branchList: any = [
    { id: 1, name: 'All Branch', value: 'all' },
    { id: 2, name: 'South zone', value: 'South zone' },
    { id: 3, name: 'Est zone', value: 'Est zone' },
  ]


  constructor(
    private route: ActivatedRoute,
    public cabService: CabService,
    public gs: GlobalService,
    private modalService: NgbModal,
    private toast: ToastService,
    public profileService: ProfileService,
    private datePipe: DatePipe,
  ) {
    window.scrollTo({ top: 180, behavior: 'smooth' });
    this.route.queryParams.subscribe((params) => {
      this.activeTab = params['activeTab'] ? params['activeTab'] : "All Cars";
      this.searchFilter.status = params['status'] ? params['status'] : 'all';
      this.getTableData();
    })
  }

  getTableData() {
    const { startDate, endDate } = this.gs.normalizeDateRange(this.dateTimeRange[0], this.dateTimeRange[1]);
    const body = {
      userId: this.gs.loggedInUserInfo.userId,
      pageNumber: this.currentPage,
      pagesize: this.pageSize,
      globalSearch: this.searchFilter.globalSearch || "",
      sortColumn: this.sortColumn,
      sortOrder: this.sortOrder,
      vin: null,
      vehicleStatus: this.activeTab == "All Cars" ? null : this.activeTab,
      startDate: startDate,
      endDate: endDate,
    }
    this.gs.isSpinnerShow = true;
    this.profileService.GetMyCarListDetails(body).subscribe(async (response: any) => {
      this.gs.isSpinnerShow = false;
      this.tableData = response.carDetails;
      this.totalData = response?.viewModel?.totalCount;
      this.booktabs = response.filterList ? JSON.parse(response.filterList) : [];
    })
  }

  selectStatus() {
    this.getTableData();
  }

  selectBranch() {
    this.getTableData();
  }

  searchData() {
    this.getTableData();
  }

  changeBookTab(item: any) {
    this.activeTab = item.name;
    this.getTableData();
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

  // async changeStatus(item: any) {
  //   // let newStatus = item.status === 'Active' ? 'Inactive' : 'Active';
  //   const modalRef = this.modalService.open(CarStatusChangeModalComponent, {
  //     centered: true,
  //   });
  //   modalRef.componentInstance.singleDetails = item;
  //   modalRef.componentInstance.title = 'Are sure you want to change status ?';
  //   modalRef.result.then((res: any) => {
  //     if (res.confirmed) {
  //       item.status = res.status;
  //       this.toast.successToastr("Status successfully");
  //     }
  //   }, () => { });
  // }

  async changeStatus(event: any, row: any) {
    let Body = {
      "userId": this.gs.loggedInUserInfo.userId,
      "vehicleId": row.vehicleId,
      "vehicleStatus": event.target.checked,
    };

    this.gs.isSpinnerShow = true;
    this.profileService.UpdateVehicleStatus(Body).subscribe((res: any) => {
      this.gs.isSpinnerShow = false;
      if (res && res.statusCode == "200") {
        this.toast.successToastr("Updated successfully");
        this.getTableData();
      } else {
        this.toast.errorToastr(res.message);
      }
    }, (err: any) => {
      this.toast.errorToastr("Something went wrong");
      this.gs.isSpinnerShow = false;
    })
  }


  updateCarPrice(item: any) {
    const modalRef = this.modalService.open(ChangeCarPriceModalComponent, {
      centered: true,
    });
    modalRef.componentInstance.singleDetails = item;
    modalRef.result.then((res: any) => {

      modalRef.result.then((res: any) => {
        if (res.confirmed) {
          item.price_per_day = res.pricing.price_per_day;
          item.price_per_week = res.pricing.price_per_week;
          item.price_per_month = res.pricing.price_per_month;
        }
      }, () => { });
    }, () => {
    });
  }

  transformDate(date: any, format: any) {
    return this.datePipe.transform(date, format);
  }

  exportToExcel() {

    const { startDate, endDate } = this.gs.normalizeDateRange(this.dateTimeRange[0], this.dateTimeRange[1]);
    const body = {
      userId: this.gs.loggedInUserInfo.userId,
      pageNumber: 1,
      pagesize: this.totalData,
      globalSearch: this.searchFilter.globalSearch || "",
      sortColumn: this.sortColumn,
      sortOrder: this.sortOrder,
      vin: null,
      vehicleStatus: this.activeTab,
      startDate: startDate,
      endDate: endDate,
    }
    this.gs.isSpinnerShow = true;
    this.profileService.GetMyCarListDetails(body).subscribe(async (response: any) => {
      this.gs.isSpinnerShow = false;
      let tableData = response.carDetails;
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
      const status: any = {
        "Booked": "FF0000", // warning
        "Kyc Pending": "FF9307", // danger
        "Available": "1FBC2F", // success
      }
      for (let i in tableData) {
        finalData.push({
          "SL": {
            ...style,
            value: Number(i) + 1,
          },
          "Vin Number": {
            ...style,
            value: tableData[i].vin || '-',
          },
          "Car Name": {
            ...style,
            value: tableData[i].make + ' (' + tableData[i].model + ')',
          },
          "Price Per Day": {
            ...style,
            value: tableData[i].perDayRentPrice || '-',
          },
          "Price Per Week": {
            ...style,
            value: tableData[i].perWeekRentPrice || '-',
          },
          "Price Per Month": {
            ...style,
            value: tableData[i].perMonthRentPrice || '-',
          },
          "Price Per Year": {
            ...style,
            value: tableData[i].perYearRentPrice || '-',
          },
          "Vehicle status": {
            ...style,
            value: tableData[i].vehicleStatus || '-',
            font: { bold: true, color: { argb: status[tableData[i].vehicleStatus] } },
          },
          "Status": {
            ...style,
            value: tableData[i].status || '-',
          },
        });
      }
      this.gs.exportToExcelCustom(finalData, "MyCars", "My Cars - " + this.activeTab)

    })
  }


}
