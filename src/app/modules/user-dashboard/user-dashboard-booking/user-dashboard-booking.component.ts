import { Component, Input } from '@angular/core';
import { CabService } from '../../../shared/services/cab.service';
import { CommonModule, DatePipe } from '@angular/common';
import { CurrencySymbolPipe } from '../../../shared/pipe/currency.pipe';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BookingService } from '../../../shared/services/booking.service';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { ToastService } from '../../../shared/services/toast.service';
import { BookingDetailsModalComponent } from '../../../shared/components/comman/modal/booking-modals/booking-details-modal/booking-details-modal.component';
import { GlobalService } from '../../../shared/services/global.service';
import { WriteReviewModalComponent } from '../../../shared/components/comman/modal/booking-modals/write-review-modal/write-review-modal.component';
import { RefundApproveRejectModalComponent } from '../../../shared/components/comman/modal/booking-modals/refund-approve-reject-modal/refund-approve-reject-modal.component';
import { ConfirmationModalComponent } from '../../../shared/components/comman/modal/confirmation-modal/confirmation-modal.component';
import { DocumentSignModalComponent } from '../../../shared/components/comman/modal/document-sign-modal/document-sign-modal.component';
import { BookingCancellationComponent } from './booking-cancellation/booking-cancellation.component';
import { OtpVerificationModalComponent } from '../user-settings/modals/otp-verification-modal/otp-verification-modal.component';
import { VerificationSuccessModalComponent } from '../user-settings/modals/verification-success-modal/verification-success-modal.component';
import { BookingChecklistComponent } from './booking-checklist/booking-checklist.component';
import { ViewAllDocumentsModalComponent } from '../../../shared/components/comman/modal/booking-modals/view-alldocuments-modal/view-alldocuments-modal.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { ExcelExportService } from '../../../shared/services/excel-export.service';
import { RolePermissionService } from '../../../shared/services/rolepermission.service';
import { RePaymentModalComponent } from '../../../shared/components/comman/modal/payment-modals/re-payment-modal/re-payment-modal.component';
import { WalletService } from '../../../shared/services/wallet.service';
import { BookingActionCardComponent } from '../../../shared/components/comman/booking-action-card/booking-action-card.component';

@Component({
  selector: 'app-user-dashboard-booking',
  standalone: true,
  imports: [
    BookingCancellationComponent,
    BookingChecklistComponent,
    BookingActionCardComponent,

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
  templateUrl: './user-dashboard-booking.component.html',
  styleUrl: './user-dashboard-booking.component.scss'
})
export class UserDashboardBookingComponent {
  public tableData: any = [];
  public searchDataValue = '';
  sortColumn: any = "bookingReferenceNumber";
  sortOrder: any = "DESC";
  pageSize: any = 10;
  totalData: any = 0;
  currentPage: any = 1;
  activeTab: any = '';
  activeTabName: any = '';
  editInfo: any = {};
  booktabs: any = []
  isShowCancellation: any = false;
  isShowChecklist: any = false;
  tempTableData: any = [];
  singleBookingDetail: any = {};
  cancellationInfo: any = {};
  dateTimeRange: any = "";


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private bookingService: BookingService,
    public cabService: CabService,
    public gs: GlobalService,
    private modalService: NgbModal,
    private toast: ToastService,
    private datePipe: DatePipe,
    private excelExport: ExcelExportService,
    public roleService: RolePermissionService,
    public walletService: WalletService,
  ) {
    this.roleService.getButtons("MYBK");
    window.scrollTo({ top: 180, behavior: 'smooth' });
    this.route.queryParams.subscribe((params) => {
      this.activeTab = params['activeTab'] ? params['activeTab'] : "All Bookings";
      this.getGridTabsDetails();
      // this.getTableData();
    })
  }

  getTableData() {
    const { startDate, endDate } = this.gs.normalizeDateRange(this.dateTimeRange[0], this.dateTimeRange[1]);
    const body = {
      "userId": this.gs.loggedInUserInfo.userId,
      "bookingStatus": JSON.stringify([this.activeTab]),
      "pageNumber": this.currentPage,
      "pagesize": this.pageSize,
      "globalSearch": this.searchDataValue?.trim() || "",
      "sortColumn": this.sortColumn,
      "sortOrder": this.sortOrder,
      "startDate": startDate,
      "endDate": endDate,
      "bookingRefNumber": null,
      "bookingType": null,
      "pickUpDate": null,
      "dropDate": null,
      "bookingDate": null,
      "duration": null,
    }
    this.gs.isSpinnerShow = true;
    this.bookingService.GetAllBookings(body).subscribe((res: any) => {
      this.gs.isSpinnerShow = false;
      if (res.response && res.response.statusCode == "200") {
        this.tableData = res.gridList;
        this.totalData = res?.viewModel?.totalCount || 0;
        // this.booktabs = res.filterList ? JSON.parse(res.filterList) : [];
      }
    });
  }

  getGridTabsDetails() {
    const body = {
      roleId: this.gs.loggedInUserInfo.roleName,
      menuId: "21",
    }
    this.roleService.GetGridTabsDetails(body).subscribe(async (response: any) => {
      this.booktabs = response || [];
      this.activeTab = this.booktabs[0].menuName;
      this.activeTabName = this.booktabs[0].name;;
      this.getTableData();
    })
  }

  public searchData(): void {
    this.currentPage = 1;
    this.getTableData();
  }

  onSort(column: any) {
    this.sortColumn = column;
    this.sortOrder = this.sortOrder === "DESC" ? "ASC" : "DESC";
    this.getTableData();
  }


  changeBookTab(row: any) {
    this.activeTab = row.menuName;
    this.activeTabName = row.name;
    console.log("bookingStatus >>>>", row);
    this.getTableData();
  }

  pageChanged(event: any) {
    this.currentPage = event;
    this.getTableData();
  }

  onView(item: any) {
    const modalRef = this.modalService.open(BookingDetailsModalComponent, {
      size: 'lg'
    });
    modalRef.componentInstance.bookingRefNo = item.bookingReferenceNumber;
    modalRef.result.then((res: any) => {

    }, () => {
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

  goToChecklist() {
    this.isShowChecklist = true;
  }

  refundApprove(item: any) {
    const modalRef = this.modalService.open(ConfirmationModalComponent, {
      centered: true,
    });
    modalRef.componentInstance.title = "Are you sure want to Approve refund request?";
    modalRef.result.then((res: any) => {
      if (res.confirmed) {
        item.status = "Refund Started";
        this.toast.successToastr("Refund request Approved successfully");
      }
    }, () => {
    });
  }

  refundReject(item: any) {
    const modalRef = this.modalService.open(RefundApproveRejectModalComponent, {
      centered: true,
    });
    modalRef.componentInstance.bookingDetails = item;
    modalRef.result.then((res: any) => {
      if (res.confirmed) {
        item.refund_rejected_reason = res.reason;
        item.status = "Refund Rejected";
        this.toast.successToastr("Refund request Rejected successfully");
      }

    }, () => {
    });
  }

  writeReview(item: any) {
    const modalRef = this.modalService.open(WriteReviewModalComponent, {
      // centered: true,
    });
    modalRef.componentInstance.singleDetails = item;
    modalRef.result.then((res: any) => {
      if (res.confirmed) {
        this.getTableData();
      }
    }, () => {
    });
  }

  viewDocument(document: any) {
    const modalRef = this.modalService.open(DocumentSignModalComponent, {
      centered: true,
      backdrop: 'static',
      windowClass: 'document-modal',
      size: 'xl'
    });
    modalRef.componentInstance.documentIframe = document;
    modalRef.result.then((res: any) => {
      if (res.confirmed) {
      }
    }, () => { });
  }

  backToBooking() {
    this.isShowCancellation = false;
    this.isShowChecklist = false;
    this.getTableData();
    window.scrollTo({ top: 280, behavior: 'smooth' });
  }

  changeStatus(data: any, status: any) {
    console.log("data >>>>>", data);

    const modalRef = this.modalService.open(ConfirmationModalComponent, {
      centered: true,
    });
    modalRef.componentInstance.title = "Are you sure you want to move to " + status + " ?";
    modalRef.result.then((res: any) => {
      if (res.confirmed) {
        if (status === "Delivered") {
          this.InitiateDeliverVehicleToDriver(data);
        }
        if (status === "Accept" || status === "Received") {
          this.singleBookingDetail = data;
          this.goToChecklist();
        }
        if (status === "Return") {
          this.ReturnVehicleToOwner(data);
        }
      }
    }, () => { });
    return;
  }

  ReturnVehicleToOwner(item: any) {
    const body = {
      "bookingId": item.bookingId,
      "userId": this.gs.loggedInUserInfo.userId,
      "riskId": item.riskId,
      "riskType": item.riskType
    }
    this.gs.isSpinnerShow = true;
    this.bookingService.ReturnVehicleToOwner(body).subscribe((res: any) => {
      this.gs.isSpinnerShow = false;
      console.log("ReturnVehicleToOwner >>>>", res);
      if (res && res.statusCode == "200") {
        this.toast.successToastr(res.message);
        this.getTableData();
      } else {
        this.toast.errorToastr(res.message);
      }
    }, (err) => {
      this.gs.isSpinnerShow = false;
      this.toast.errorToastr(err.error.message);
    });
  }

  InitiateDeliverVehicleToDriver(item: any) {
    const body = {
      "bookingId": item.bookingId,
      "userId": this.gs.loggedInUserInfo.userId,
      "riskId": item.riskId,
      "riskType": item.riskType
    }
    this.gs.isSpinnerShow = true;
    this.bookingService.InitiateDeliverVehicleToDriver(body).subscribe((res: any) => {
      this.gs.isSpinnerShow = false;
      if (res && res.statusCode == "200") {
        this.toast.successToastr(res.message);
        this.getTableData();
      } else {
        this.toast.errorToastr(res.message);
      }
    }, (err) => {
      this.gs.isSpinnerShow = false;
      this.toast.errorToastr(err.error.message);
    });
  }

  onViewDocument(item: any) {
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

  makeRePayment(data: any) {
    const modalRef = this.modalService.open(RePaymentModalComponent, {
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.title = "Are you sure you received the payment in TLH account?";
    modalRef.componentInstance.singleItem = data;
    modalRef.result.then(async (res: any) => {
      if (res.confirmed) {
        console.log("res >>>>>", res);
        this.getTableData();
        return;
      }
    }, () => { });
    return;
  }

  transformDate(date: any, format: any) {
    return this.datePipe.transform(date, format);
  }

  exportToExcel() {
    const { startDate, endDate } = this.gs.normalizeDateRange(this.dateTimeRange[0], this.dateTimeRange[1]);
    const body = {
      "userId": this.gs.loggedInUserInfo.userId,
      "status": JSON.stringify([this.activeTab]),
      "globalSearch": this.searchDataValue?.trim() || "",
      "startDate": startDate,
      "endDate": endDate,
    }
    this.gs.isSpinnerShow = true;
    this.excelExport.exportToExcelPost(body, 'ExportUserBookingsToExcel').subscribe((response: any) => {
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
          "Reference Number": {
            ...style,
            value: tableData[i].bookingReferenceNumber || '-',
          },
          "Status": {
            ...style,
            value: tableData[i].bookingStatus || '-',
            font: { bold: true, color: { argb: status[tableData[i].bookingStatus] } },
          },
          "Status Remarks": {
            ...style,
            value: tableData[i].bookingStatusRemarks || '-',
          },
          "Booking Type": {
            ...style,
            value: tableData[i].riskType || '-',
          },
          "Pickup Date": {
            ...style,
            value: this.transformDate(tableData[i].pickUpDate, 'MMM d, y, h:mm a') || '-',
          },
          "Duration": {
            ...style,
            value: tableData[i].bookingDuration || '-',
          },
          "Total Amount": {
            ...style,
            value: tableData[i].totalAmount || '-',
            font: { bold: true },
            alignment: { ...style.alignment, ...{ horizontal: 'right' } },
          },
        });
      }
      this.excelExport.exportToExcelCustom(finalData, "MyBookings", "My Bookings - " + this.activeTab)
    });
  }

  nextStep() {
    this.router.navigate(['/user/payments']);
  }

  handleAction(actionType: string, booking: any) {
    console.log('Action received:', actionType);

    if (actionType === 'SIGN') {
      this.viewDocument(booking.document)
    }
    else if (actionType === 'CONFIRM_HANDOVER') {
      this.changeStatus(booking, 'Delivered')
    }
    else if (actionType === 'INSPECT_PICKUP') {
      this.changeStatus(booking, 'Accept');
    }
    else if (actionType === 'INITIATE_RETURN') {
      this.changeStatus(booking, 'Return');
    }
    else if (actionType === 'INSPECT_RETURN') {
      this.changeStatus(booking, 'Received');
    }
  }
}
