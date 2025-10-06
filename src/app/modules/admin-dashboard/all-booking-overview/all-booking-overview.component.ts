import { Component, Input } from '@angular/core';
import { CabService } from '../../../shared/services/cab.service';
import { CommonModule } from '@angular/common';
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

@Component({
  selector: 'app-all-booking-overview',
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
  ],
  templateUrl: './all-booking-overview.component.html',
  styleUrl: './all-booking-overview.component.scss'
})
export class AllBookingOverviewComponent {
  public tableData: any = [];
  public searchDataValue = '';
  public pageSize = 10;
  public totalData = 0;
  public currentPage = 1;

  public activeTab = '';
  public activeTypes = '';
  sortColumn: any = "";
  sortOrder: any = "DESC";

  public searchFilter: any = {
    // user_type: 'all',
    status: 'All Bookings',
  };
  tabs: any = []
  bookTypes = [
    { title: "Cars", value: "Vehicle" },
    { title: "Drivers", value: "Driver" },
  ]
  vehicleStatusList: any = [
    { name: "All Bookings", value: "All Bookings" },
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

  ) {
    window.scrollTo({ top: 180, behavior: 'smooth' });
    this.route.queryParams.subscribe((params) => {
      this.activeTypes = params['activeTypes'] ? params['activeTypes'] : "Vehicle";
      if (this.activeTypes === 'Vehicle') {
        this.activeTab = params['activeTab'] ? params['activeTab'] : "Driver with owned car";
      }
      if (this.activeTypes === 'Driver') {
        this.activeTab = params['activeTab'] ? params['activeTab'] : "All Bookings";
      }
      this.getTableData();
    })
  }

  getTableData() {
    this.gs.isSpinnerShow = true;
    const body = {
      "pageNumber": this.currentPage,
      "pagesize": this.pageSize,
      "globalSearch": this.searchDataValue?.trim() || "",
      "sortColumn": this.sortColumn,
      "sortOrder": this.sortOrder,
      "userType": JSON.stringify([this.activeTab]),
      "bookingStatus": this.searchFilter.status == 'All Bookings' ? null : JSON.stringify([this.searchFilter.status]),
      "riskType": this.activeTypes,
    }
    this.adminService.GetAllBookingOverviewForAdmin(body).subscribe((response: any) => {
      this.tableData = [];
      this.gs.isSpinnerShow = false;
      if (response && response.responseResultDtos && response.responseResultDtos.statusCode == "200") {
        this.tableData = response.bookingOverviews;
        this.totalData = response.viewModel?.totalCount || 0;
        this.tabs = response.filterList ? JSON.parse(response.filterList) : [];
      } else {
        this.toast.errorToastr(response.message);
      }
    });
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
    this.activeTypes = item.value;
    if (item.value === 'Vehicle') {
      this.activeTab = "Driver with owned car";
    }
    if (item.value === 'Driver') {
      this.activeTab = "All Bookings";
    }
    let params = {
      activeTypes: this.activeTypes,
      activeTab: this.activeTab,
    }
    this.currentPage = 1;
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

  exportToExcel() {
    const body = {
      "pageNumber": 1,
      "pagesize": this.totalData,
      "globalSearch": this.searchDataValue?.trim() || "",
      "sortColumn": this.sortColumn,
      "sortOrder": this.sortOrder,
      "userType": JSON.stringify([this.activeTab]),
      "bookingStatus": this.searchFilter.status == 'All Bookings' ? null : JSON.stringify([this.searchFilter.status]),
      "riskType": this.activeTypes,
    }
    this.adminService.GetAllBookingOverviewForAdmin(body).subscribe((response: any) => {
      this.gs.isSpinnerShow = false;
      if (response && response.responseResultDtos && response.responseResultDtos.statusCode == "200") {

        let tableData = response.bookingOverviews;
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
              value: tableData[i].bookingDate || '-',
            },
            "Pickup Date": {
              ...style,
              value: tableData[i].pickUpDate || '-',
            },
            "End Date": {
              ...style,
              value: tableData[i].endDate || '-',
            },
            "Duration": {
              ...style,
              value: tableData[i].bookingDuration || '-',
            },
            "Price": {
              ...style,
              value: (tableData[i].pricePerBooking + ' per ' + tableData[i].durationType) || '-',
            },
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
        this.gs.exportToExcelCustom(finalData, "VehiclesBookings", title);
      } else {
        this.toast.errorToastr(response.message);
      }
    });
  }

}
