import { Component, Input } from '@angular/core';
import { CabService } from '../../../shared/services/cab.service';
import { CommonModule, DatePipe } from '@angular/common';
import { CurrencySymbolPipe } from '../../../shared/pipe/currency.pipe';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgxPaginationModule, PaginationService } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { PaymentService } from '../../../shared/services/payment.service';
import { InvoiceModalComponent } from '../../../shared/components/comman/modal/payment-modals/invoice-modal/invoice-modal.component';
import { GlobalService } from '../../../shared/services/global.service';
import { ConfirmationModalComponent } from '../../../shared/components/comman/modal/confirmation-modal/confirmation-modal.component';
import { ToastService } from '../../../shared/services/toast.service';
import { AdminService } from '../../../shared/services/admin.service';
import { UserCancellationRefundComponent } from '../user-cancellation-refund/user-cancellation-refund.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { ExcelExportService } from '../../../shared/services/excel-export.service';

@Component({
  selector: 'app-user-dashboard-payments',
  standalone: true,
  imports: [
    UserCancellationRefundComponent,
    CommonModule,
    FormsModule,
    NgbModule,
    NgxPaginationModule,
    MatMenuModule,
    MatButtonModule,
    CurrencySymbolPipe,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
  ],
  providers: [DatePipe],
  templateUrl: './user-dashboard-payments.component.html',
  styleUrl: './user-dashboard-payments.component.scss'
})
export class UserDashboardPaymentsComponent {

  sortColumn: any = "";
  sortOrder: any = "DESC";
  public tableData: any = [];
  public searchDataValue = '';
  public pageSize = 10;
  public totalData = 0;
  public currentPage = 1;
  dateTimeRange: any = "";

  tabs: any = [
    { "name": "All Payments", "value": "All Payments" },
    { "name": "Pending Confirmation", "value": "Pending Confirm" },
    { "name": "Pending Clearance", "value": "Pending Clearance" },
    // { "name": "Cleared", "value": "Cleared" },
    { "name": "Refund", "value": "Refund" },
  ]
  activeTab: any = "";
  tempTableData: any = [];
  isRefundTab: boolean = false;
  walletInfo: any = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService,
    private adminService: AdminService,
    public cabService: CabService,
    public gs: GlobalService,
    private modalService: NgbModal,
    private toast: ToastService,
    private datePipe: DatePipe,
    private excelExport: ExcelExportService,
  ) {
    window.scrollTo({ top: 180, behavior: 'smooth' });
    this.route.queryParams.subscribe((params) => {
      this.activeTab = params['activeTab'] ? params['activeTab'] : "All Payments";
      console.log("this.activeTab >>>>>", this.activeTab);

      if (this.activeTab == "Refund") {
        this.isRefundTab = true;
      } else {
        this.isRefundTab = false;
        this.getTableData();
      }
      this.getTLHPaymentOverview();
    })
  }

  getTableData() {
    const { startDate, endDate } = this.gs.normalizeDateRange(this.dateTimeRange[0], this.dateTimeRange[1]);
    const body = {
      "userId": this.gs.loggedInUserInfo.userId,
      "pageNumber": this.currentPage,
      "pagesize": this.pageSize,
      "sortColumn": this.sortColumn,
      "sortOrder": this.sortOrder,
      "globalSearch": this.searchDataValue?.trim() || "",
      "startDate": startDate,
      "endDate": endDate,
      "paymentMethod": null,
      "paymentType": null,
      "transactionType": null,
      "paymentRefNumber": null,
      "paymentDate": null,
      "paymentStatus": null,
      "bookingRefNumber": null,
    };

    if (this.activeTab == "All Payments") {
      this.gs.isSpinnerShow = true;
      this.paymentService.GetAllBookingPayments(body).subscribe((response: any) => {
        this.gs.isSpinnerShow = false;
        if (response.response && response.response.statusCode == "200") {
          this.tableData = response.gridList;
          this.totalData = response.viewModel?.totalCount;
        }
      });
    }

    if (this.activeTab == "Pending Confirmation") {
      this.gs.isSpinnerShow = true;
      this.adminService.GetPendingConfirmationBookingPayments(body).subscribe((response: any) => {
        this.gs.isSpinnerShow = false;
        if (response.response && response.response.statusCode == "200") {
          this.tableData = response.gridList;
          this.totalData = response.viewModel?.totalCount;
        }
      });
    }

    if (this.activeTab == "Pending Clearance") {
      this.gs.isSpinnerShow = true;
      this.adminService.GetPendingClearanceBookingPayments(body).subscribe((response: any) => {
        this.gs.isSpinnerShow = false;
        if (response.response && response.response.statusCode == "200") {
          this.tableData = response.gridList;
          this.totalData = response.viewModel?.totalCount;
        }
      });
    }

  }

  getTLHPaymentOverview() {
    if (this.gs.loggedInUserInfo.role == 'admin' || this.gs.loggedInUserInfo.role == 'Accountant') {
      this.adminService.GetTLHPaymentOverview({
        "userId": this.gs.loggedInUserInfo.userId,
      }).subscribe((response: any) => {
        if (response) {
          this.walletInfo = JSON.parse(response);
        }
      });
    }
  }

  searchData() {
    this.getTableData();
    this.getTLHPaymentOverview();
  }

  pageChanged(event: any) {
    this.currentPage = event;
    this.getTableData();
  }

  onView(item: any) {
    console.log("item >>>>>", item);

    const body = {
      "bookingRefNo": item.bookingReferenceNumber,
      "loginUserId": this.gs.loggedInUserInfo.userId
    }
    this.gs.isSpinnerShow = true;
    this.paymentService.GetBookingByBookingRefNo(body).subscribe((response: any) => {
      this.gs.isSpinnerShow = false;
      if (response.response && response.response.statusCode == "200") {
        const modalRef = this.modalService.open(InvoiceModalComponent, {
          size: 'xl'
        });
        modalRef.componentInstance.invoiceDetails = response;
      }
    })
  }

  changeBookTab(row: any) {
    this.activeTab = row.name;
    this.currentPage = 1;
    this.tableData = [];
    this.totalData = 0;
    let params = {
      activeTab: this.activeTab,
    }
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: "merge"
    });
  }

  changeStatus(data: any, status: any) {
    const modalRef = this.modalService.open(ConfirmationModalComponent, {
      centered: true,
    });
    modalRef.componentInstance.title = status == "Confirm" ? "Are you sure you received the payment in TLH account?" : "Are you sure you want to payment disburse ?";
    modalRef.result.then((res: any) => {
      if (res.confirmed) {
        // const oldStatus = JSON.parse(JSON.stringify(data.admin_status));
        // data.admin_status = status == "Confirm" ? "Pending Disburse" : "Cleared";
        // this.tableData = this.tempTableData.filter((item: any) => item.admin_status == oldStatus);
        // this.totalData = this.tableData.length;
        if (status == "Confirm") {
          this.toast.successToastr("Payment confirm has been received in TLH account.");
        } else {
          this.toast.successToastr("Payment disbursed successfully.");
        }
      }
    }, () => { });
    return;
  }

  onSort(column: any) {
    this.sortColumn = column;
    this.sortOrder = this.sortOrder === "DESC" ? "ASC" : "DESC";
    this.getTableData();
  }

  transformDate(date: any, format: any) {
    return this.datePipe.transform(date, format);
  }

  exportToExcel() {
    const { startDate, endDate } = this.gs.normalizeDateRange(this.dateTimeRange[0], this.dateTimeRange[1]);
    const body = {
      "userId": this.gs.loggedInUserInfo.userId,
      "globalSearch": this.searchDataValue?.trim() || "",
      "startDate": startDate,
      "endDate": endDate,
    };
    const endpoint: any = {
      "All Payments": (this.gs.loggedInUserInfo.role == 'admin' || this.gs.loggedInUserInfo.role == 'Accountant') ? "ExportAllBookingPaymentsToExcel" : "ExportUserBookingPaymentsToExcel",
      "Pending Confirmation": "ExportAllPendingConfirmationPaymentsToExcel",
      "Pending Clearance": "ExportAllPendingClearancePaymentsToExcel",
    }
    this.gs.isSpinnerShow = true;
    this.excelExport.exportToExcelPost(body, endpoint[this.activeTab]).subscribe((response: any) => {
      this.gs.isSpinnerShow = false;
      let tableData = JSON.parse(response);
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
        "Pending Clearance": "FF9307", // warning
        "Pending Disburs": "127384", // secondary
        "Failed": "FF0000", // danger
        "Cleared": "1FBC2F", // success
      }
      for (let i in tableData) {
        finalData.push({
          "SL": {
            ...style,
            value: Number(i) + 1,
          },
          "Payment ID": {
            ...style,
            value: tableData[i].paymentReferenceNumber || '-',
          },
          "Reference Number": {
            ...style,
            value: tableData[i].bookingReferenceNumber || '-',
          },
          "Car Name": {
            ...style,
            value: tableData[i].Make + ' ' + tableData[i].Model || '-',
          },
          "Driver Name": {
            ...style,
            value: tableData[i].driverName || '-',
          },
          "Payment Date": {
            ...style,
            value: this.transformDate(tableData[i].createdDate, 'MMM d, y, h:mm a') || '-',
          },
          "Payment Mode": {
            ...style,
            value: tableData[i].paymentMethod || '-',
          },
          "Total Amount": {
            ...style,
            value: tableData[i].amount || '-',
            font: { bold: true },
            alignment: { ...style.alignment, ...{ horizontal: 'right' } },
            isTotal: true,
          },
          "Status": {
            ...style,
            value: tableData[i].paymentStatus || '-',
            font: { bold: true, color: { argb: status[tableData[i].paymentStatus] } },
          },
        });
        if (this.gs.loggedInUserInfo['role'] === 'user') {
          delete finalData[i]['Driver Name'];
        }
      }

      this.excelExport.exportToExcelCustom(finalData, "MyPayments", "My Payments");
    });
  }
}
