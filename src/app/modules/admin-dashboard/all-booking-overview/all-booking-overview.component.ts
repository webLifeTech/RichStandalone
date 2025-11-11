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
import { BookingDetailsModalComponent } from '../../../shared/components/comman/modal/booking-modals/booking-details-modal/booking-details-modal.component';
import { GlobalService } from '../../../shared/services/global.service';
import { DriversBookingDetailsModalComponent } from '../../../shared/components/comman/modal/booking-modals/drivers-booking-details-modal/drivers-booking-details-modal.component';
import { AdminService } from '../../../shared/services/admin.service';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { ExcelExportService } from '../../../shared/services/excel-export.service';
import { ViewAllDocumentsModalComponent } from '../../../shared/components/comman/modal/booking-modals/view-alldocuments-modal/view-alldocuments-modal.component';
import { BookingCancellationComponent } from '../../user-dashboard/user-dashboard-booking/booking-cancellation/booking-cancellation.component';
import { BookingService } from '../../../shared/services/booking.service';
import { RolePermissionService } from '../../../shared/services/rolepermission.service';

@Component({
  selector: 'app-all-booking-overview',
  standalone: true,
  imports: [
    BookingCancellationComponent,

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
  templateUrl: './all-booking-overview.component.html',
  styleUrl: './all-booking-overview.component.scss'
})
export class AllBookingOverviewComponent {
  public tableData: any = [];
  public searchDataValue = '';
  public pageSize = 10;
  public totalData = 0;
  public currentPage = 1;
  dateTimeRange: any = "";

  public activeTab = '';
  public activeTypes = '';
  public selectedMenuID = '';
  sortColumn: any = "";
  sortOrder: any = "DESC";

  isShowCancellation: any = false;
  singleBookingDetail: any = {};
  cancellationInfo: any = {};

  public searchFilter: any = {
    // user_type: 'all',
    status: 'All Status',
  };
  tabs: any = [];
  bookTypes: any = [
    // { title: "Cars", value: "Vehicle" },
    // { title: "Drivers", value: "Driver" },
  ]
  vehicleStatusList: any = [
    { name: "All Status", value: "All Status" },
    { name: "Confirmed", value: "Confirmed" },
    { name: "Pending Request", value: "Pending Request" },
    { name: "Start Service", value: "Start Service" },
    { name: "End Service", value: "End Service" },
    { name: "Cancelled", value: "Cancelled" },
  ]

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public cabService: CabService,
    private adminService: AdminService,
    public gs: GlobalService,
    private modalService: NgbModal,
    private toast: ToastService,
    private bookingService: BookingService,
    private datePipe: DatePipe,
    private excelExport: ExcelExportService,
    public roleService: RolePermissionService,
  ) {
    window.scrollTo({ top: 180, behavior: 'smooth' });
    this.roleService.getButtons("BKOV");
    this.route.queryParams.subscribe((params) => {
      this.activeTypes = params['activeTypes'] ? params['activeTypes'] : "Vehicle";
      this.activeTab = params['activeTab'] ? params['activeTab'] : "All Bookings";
      if (this.bookTypes.length && this.tabs.length) {
        this.getTableData();
      } else {
        this.getGridTabsDetails();
      }
    })
  }

  getTableData() {
    const { startDate, endDate } = this.gs.normalizeDateRange(this.dateTimeRange[0], this.dateTimeRange[1]);
    const body = {
      "pageNumber": this.currentPage,
      "pagesize": this.pageSize,
      "globalSearch": this.searchDataValue?.trim() || "",
      "sortColumn": this.sortColumn,
      "sortOrder": this.sortOrder,
      "userType": JSON.stringify([this.activeTab]),
      "bookingStatus": this.searchFilter.status == 'All Status' ? null : JSON.stringify([this.searchFilter.status]),
      "riskType": this.activeTypes,
      "startDate": startDate,
      "endDate": endDate,
    }
    this.gs.isSpinnerShow = true;
    this.adminService.GetAllBookingOverview(body).subscribe((response: any) => {
      this.tableData = [];
      this.gs.isSpinnerShow = false;
      if (response.response && response.response.statusCode == "200") {
        this.tableData = response.gridList;
        this.totalData = response.viewModel?.totalCount || 0;
        // this.tabs = response.filterList ? JSON.parse(response.filterList) : [];
      } else {
        this.toast.errorToastr(response.message);
      }
    });
  }

  getGridTabsDetails() {
    const body = {
      roleId: this.gs.loggedInUserInfo.roleName,
      menuId: "38",
    }
    this.gs.isSpinnerShow = true;
    this.roleService.GetGridTabsDetails(body).subscribe(async (response: any) => {
      this.bookTypes = response || [];
      if (this.bookTypes.length) {
        this.selectedMenuID = this.bookTypes[0].menuID;
        this.getGridSubTabsDetails();
        console.log("selectedMenuID >>>>>>", this.selectedMenuID);
      }
    })
  }

  getGridSubTabsDetails() {
    const body = {
      roleId: this.gs.loggedInUserInfo.roleName,
      menuId: this.selectedMenuID,
    }
    this.roleService.GetGridTabsDetails(body).subscribe(async (response: any) => {
      this.gs.isSpinnerShow = false;
      this.tabs = response || [];
      this.getTableData();
    })
  }

  changeBookTab(item: any) {
    this.activeTab = item.name;
    this.currentPage = 1;

    let params = {
      activeTypes: this.activeTypes,
      activeTab: this.activeTab
    }
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: "merge"
    });
  }

  changeTypes(item: any) {
    this.selectedMenuID = item.menuID;
    this.activeTypes = item.menuID == '41' ? 'Vehicle' : 'Driver';
    this.currentPage = 1;
    this.activeTab = "All Bookings";

    let params = {
      activeTypes: this.activeTypes,
      activeTab: this.activeTab,
    }
    this.getGridSubTabsDetails();
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: "merge"
    });
  }

  selectStatus() {
    this.currentPage = 1;
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

  onView(item: any) {
    const modalRef = this.modalService.open(BookingDetailsModalComponent, {
      size: 'lg'
    });
    modalRef.componentInstance.bookingRefNo = item.bookingReferenceNumber;
    modalRef.result.then((res: any) => {
    }, () => { });
  }

  onViewDriversBooking(item: any) {
    const modalRef = this.modalService.open(DriversBookingDetailsModalComponent, {
      size: 'lg'
    });
    modalRef.componentInstance.bookingDetails = item;
    modalRef.result.then((res: any) => {
    }, () => {
    });
  }

  searchData() {
    this.currentPage = 1;
    this.getTableData();
  }

  onViewDocument(item: any) {
    console.log("item >>>", item);

    const modalRef = this.modalService.open(ViewAllDocumentsModalComponent, {
      size: 'lg'
    });
    modalRef.componentInstance.bookingDetails = item;
  }

  GetCarBookingCancellationInfo() {
    this.gs.isSpinnerShow = true;
    const todayDate = new Date();
    this.bookingService.GetCarBookingCancellationInfo({
      bookingId: this.singleBookingDetail.bookingId,
      cancelDate: todayDate.toISOString(),
      loginUserId: this.gs.loggedInUserInfo.userId,
    }).subscribe((response: any) => {
      this.gs.isSpinnerShow = false;
      console.log("GetCarBookingCancellationInfo >>>>>", response);
      if (response && response.responseResult && response.responseResult.statusCode == "200") {
        this.cancellationInfo = response;
        this.isShowCancellation = true;
        window.scrollTo({ top: 180, behavior: 'smooth' });
      } else {
        this.toast.errorToastr(response.responseResult.message);
      }
    }, (error) => {
      this.toast.errorToastr(error.error.Message);
      this.gs.isSpinnerShow = false;
    });
  }

  GetDriverBookingCancellationInfo() {
    this.gs.isSpinnerShow = true;
    const todayDate = new Date();
    this.bookingService.GetDriverBookingCancellationInfo({
      bookingId: this.singleBookingDetail.bookingId,
      cancelDate: todayDate.toISOString(),
      loginUserId: this.gs.loggedInUserInfo.userId,
    }).subscribe((response: any) => {
      this.gs.isSpinnerShow = false;
      console.log("GetDriverBookingCancellationInfo >>>>>", response);
      if (response && response.responseResult && response.responseResult.statusCode == "200") {
        this.cancellationInfo = response;
        this.isShowCancellation = true;
        window.scrollTo({ top: 180, behavior: 'smooth' });
      } else {
        this.toast.errorToastr(response.responseResult.message);
      }
    }, (error) => {
      this.toast.errorToastr(error.error.Message);
      this.gs.isSpinnerShow = false;
    });
  }

  bookingCancel(item: any) {
    this.singleBookingDetail = item;
    if (this.singleBookingDetail.riskType == "Vehicle") {
      this.GetCarBookingCancellationInfo();
    }
    if (this.singleBookingDetail.riskType == "Driver") {
      this.GetDriverBookingCancellationInfo();
    }
  }

  backToBooking() {
    this.isShowCancellation = false;
    this.getTableData();
    window.scrollTo({ top: 280, behavior: 'smooth' });
  }

  transformDate(date: any, format: any) {
    return this.datePipe.transform(date, format);
  }

  exportToExcel() {
    const { startDate, endDate } = this.gs.normalizeDateRange(this.dateTimeRange[0], this.dateTimeRange[1]);
    const body = {
      "globalSearch": this.searchDataValue?.trim() || "",
      "userType": JSON.stringify([this.activeTab]),
      "status": this.searchFilter.status == 'All Status' ? null : JSON.stringify([this.searchFilter.status]),
      "riskType": this.activeTypes,
      "startDate": startDate,
      "endDate": endDate,
    }
    this.gs.isSpinnerShow = true;
    this.excelExport.exportToExcelPost(body, 'ExportAllBookingOverviewToExcel').subscribe((response: any) => {
      this.gs.isSpinnerShow = false;
      let tableData = JSON.parse(response);
      console.log("ExportAllBookingOverviewToExcel tableData >>", tableData);
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
        "Confirmed": "127384", // secondary
        "Delivered": "FF9307", // warning
        "Pending Request": "FF9307", // warning
        "Start Service": "FF9307", // warning
        "Cancelled": "FF0000", // danger
        "Refund Started": "FF0000", // danger
        "Refund Received": "FF0000", // danger
        "Refund Rejected": "FF0000", // danger
        "Received": "1FBC2F", // success
        "End Service": "1FBC2F", // success
      }

      for (let i in tableData) {
        finalData.push({
          "SL": {
            ...style,
            value: Number(i) + 1,
          },
          "Booking ID": {
            ...style,
            value: tableData[i].bookingReferenceNumber || '-',
          },
          "Car Name": {
            ...style,
            value: tableData[i].carName || '-',
          },
          "Driver Name": {
            ...style,
            value: tableData[i].driver_name || '-',
          },
          "Booked On": {
            ...style,
            value: this.transformDate(tableData[i].bookingDate, 'MMM d, y, h:mm a') || '-',
          },
          "Pickup Date": {
            ...style,
            value: this.transformDate(tableData[i].pickUpDate, 'MMM d, y, h:mm a') || '-',
          },
          "End Date": {
            ...style,
            value: this.transformDate(tableData[i].endDate, 'MMM d, y, h:mm a') || '-',
          },
          "Duration": {
            ...style,
            value: tableData[i].bookingDuration || '-',
          },
          // "Price": {
          //   ...style,
          //   value: (tableData[i].pricePerBooking + ' per ' + tableData[i].durationType) || '-',
          // },
          "Total Amount": {
            ...style,
            value: tableData[i].totalAmount || '-',
            font: { bold: true },
            alignment: { ...style.alignment, ...{ horizontal: 'right' } },
            isTotal: true,
          },
          "Status": {
            ...style,
            value: tableData[i].bookingStatus || '-',
            font: { bold: true, color: { argb: status[tableData[i].bookingStatus] } },
          },
        });

        if (this.activeTypes === 'Vehicle') {
          delete finalData[i]['Driver Name'];
        }
        if (this.activeTypes === 'Driver') {
          delete finalData[i]['Car Name'];
        }
      }
      let title = this.activeTypes + ' Bookings - ' + this.activeTab + ' - ' + this.searchFilter.status;
      this.excelExport.exportToExcelCustom(finalData, "VehiclesBookings", title);
    });
  }

}
