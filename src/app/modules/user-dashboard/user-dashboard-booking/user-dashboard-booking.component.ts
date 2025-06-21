import { Component, Input } from '@angular/core';
import { CabService } from '../../../shared/services/cab.service';
import { MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { CurrencySymbolPipe } from '../../../shared/pipe/currency.pipe';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgxPaginationModule, PaginationService } from 'ngx-pagination';
import { apiResultFormat, pageSelection, userBookings } from '../../../shared/services/model/model';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BookingService } from '../../../shared/services/booking.service';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { ToastService } from '../../../shared/services/toast.service';
import { DeleteModalComponent } from '../../../shared/components/comman/modal/booking-modals/delete-modal/delete-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { BookingDetailsModalComponent } from '../../../shared/components/comman/modal/booking-modals/booking-details-modal/booking-details-modal.component';
import { GlobalService } from '../../../shared/services/global.service';
import { BookingCancelModalComponent } from '../../../shared/components/comman/modal/booking-modals/booking-cancel-modal/booking-cancel-modal.component';
import { WriteReviewModalComponent } from '../../../shared/components/comman/modal/booking-modals/write-review-modal/write-review-modal.component';
import { RefundApproveRejectModalComponent } from '../../../shared/components/comman/modal/booking-modals/refund-approve-reject-modal/refund-approve-reject-modal.component';
import { ConfirmationModalComponent } from '../../../shared/components/comman/modal/confirmation-modal/confirmation-modal.component';
import { DocumentSignModalComponent } from '../../../shared/components/comman/modal/document-sign-modal/document-sign-modal.component';
import { BookingCancellationComponent } from './booking-cancellation/booking-cancellation.component';
import { OtpVerificationModalComponent } from '../user-settings/modals/otp-verification-modal/otp-verification-modal.component';
import { VerificationSuccessModalComponent } from '../user-settings/modals/verification-success-modal/verification-success-modal.component';
import { BookingChecklistComponent } from './booking-checklist/booking-checklist.component';

@Component({
  selector: 'app-user-dashboard-booking',
  standalone: true,
  imports: [
    BookingCancellationComponent,
    BookingChecklistComponent,

    CommonModule,
    FormsModule,
    RouterLink,
    NgbModule,
    NgxPaginationModule,
    MatMenuModule,
    MatButtonModule,
    CurrencySymbolPipe,
  ],
  templateUrl: './user-dashboard-booking.component.html',
  styleUrl: './user-dashboard-booking.component.scss'
})
export class UserDashboardBookingComponent {
  public tableData: any = [];
  dataSource!: MatTableDataSource<userBookings>;
  public searchDataValue = '';
  sortColumn: any = "bookingDate";
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
  selectedRefNo: any = "";
  tempTableData: any = [];


  constructor(
    // private data: DataService,
    private router: Router,
    private route: ActivatedRoute,
    private bookingService: BookingService,
    public cabService: CabService,
    public gs: GlobalService,
    private dialog: MatDialog,
    private modalService: NgbModal,
    private toast: ToastService,

  ) {
    window.scrollTo({ top: 180, behavior: 'smooth' });
    this.route.queryParams.subscribe((params) => {
      this.activeTab = params['activeTab'] ? params['activeTab'] : "All Bookings";
      this.getTableData();
    })
  }

  getTableData() {

    const body = {
      "userId": this.gs.loggedInUserInfo.userId, // "c5c9b193-64ec-46ae-b1a1-f646bc1e0933" // this.gs.loggedInUserInfo.userId
      "bookingStatus": JSON.stringify([this.activeTab]),
      "pageNumber": this.currentPage,
      "pagesize": this.pageSize,
      "globalSearch": this.searchDataValue || "",
      "sortColumn": this.sortColumn,
      "sortOrder": this.sortOrder
    }
    this.gs.isSpinnerShow = true;
    this.bookingService.GetAllBookings(body).subscribe((res: any) => {
      console.log("res >>>>>", res);
      this.gs.isSpinnerShow = false;
      this.tableData = res?.bookingMatches || [];
      this.tempTableData = JSON.parse(JSON.stringify(res?.bookingMatches)) || [];
      this.totalData = res?.viewModel?.totalCount || 0;
      this.booktabs = res.filterList ? JSON.parse(res.filterList) : [];
      let tabName = this.booktabs.find((item: any) => item.name === this.activeTab)?.name;
      this.activeTabName = tabName;
    });
  }

  public searchData(): void {
    // this.dataSource.filter = value.trim().toLowerCase();
    // this.tableData = this.dataSource.filteredData;
    this.getTableData();
  }

  initChecked = false;

  changeBookTab(row: any) {
    this.activeTab = row.name;
    console.log("bookingStatus >>>>", row);


    if (this.activeTab == "All Bookings") {
      this.getTableData();
    } else {
      this.tableData = this.tempTableData.filter((item: any) => item.bookingStatus == row.name);
      this.totalData = this.tableData.length;
      let tabName = this.booktabs.find((item: any) => item.name === this.activeTab)?.name;
      this.activeTabName = tabName;
    }
    // let params = {
    //   activeTab: this.activeTab
    // }
    // this.router.navigate([], {
    //   relativeTo: this.route,
    //   queryParams: params,
    //   queryParamsHandling: "merge"
    // });
  }

  selectAll(initChecked: boolean) {
    if (!initChecked) {
      this.tableData.forEach((f: any) => {
        f.isSelected = true;
      });
    } else {
      this.tableData.forEach((f: any) => {
        f.isSelected = false;
      });
    }
  }

  pageChanged(event: any) {
    this.currentPage = event;
    this.getTableData();
  }

  openImportantNoticeDialog(): void {
    this.dialog.open(DeleteModalComponent, {
      width: '100%',
      data: {}
    });
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
    this.isShowCancellation = true;
    this.selectedRefNo = item.bookingReferenceNumber;
    window.scrollTo({ top: 180, behavior: 'smooth' });
    return;
    const modalRef = this.modalService.open(BookingCancelModalComponent, {
      // centered: true,
      size: 'xl'
    });
    modalRef.componentInstance.bookingRefNo = item.bookingReferenceNumber;
    modalRef.result.then((res: any) => {
      if (res.confirmed) {
        // item.reason = res.reason;
        // item.status = "Cancelled";

        const body = {
          "userId": this.gs.loggedInUserInfo.userId, // "c5c9b193-64ec-46ae-b1a1-f646bc1e0933" // this.gs.loggedInUserInfo.userId
          "bookingRefNo": item.bookingReferenceNumber,
          "cancellationReason": res.reason,
        }
        this.gs.isSpinnerShow = true;
        this.bookingService.BookingCancellationRequest(body).subscribe((res: any) => {
          console.log("BookingCancellationRequest >>>>>", res);
          this.gs.isSpinnerShow = false;
          if (res && res.statusCode == "200") {
            this.toast.successToastr(res.message);
            this.getTableData();
          } else {
            this.toast.errorToastr(res.message);
          }
        });
      }
    }, () => {
    });
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
    modalRef.componentInstance.bookingDetails = item;
    modalRef.result.then((res: any) => {
      if (res.confirmed) {
        this.toast.successToastr("Review & Rating added successfully");
      }

    }, () => {
    });
  }


  async onDelete(index: any) {
    const modalRef = this.modalService.open(DeleteModalComponent, {
      centered: true,
    });
    modalRef.result.then((res: any) => {

      if (res.confirmed) {
      }
    }, () => {
    });
  }

  viewDocument(document: any) {
    const modalRef = this.modalService.open(DocumentSignModalComponent, {
      centered: true,
      // fullscreen: true,
      backdrop: 'static',
      windowClass: 'document-modal',
      size: 'xl'
    });
    modalRef.componentInstance.documentIframe = document;
    modalRef.result.then((res: any) => {
      if (res.confirmed) {
        // this.router.navigate(['/cab/booking/booking-success', this.params.type]);
      }
    }, () => { });
  }

  backToBooking() {
    this.isShowCancellation = false;
    this.isShowChecklist = false;
  }

  changeStatus(data: any, status: any) {
    const modalRef = this.modalService.open(ConfirmationModalComponent, {
      centered: true,
    });
    modalRef.componentInstance.title = "Are you sure you want to move to " + status + " ?";
    modalRef.result.then((res: any) => {
      if (res.confirmed) {
        const oldStatus = JSON.parse(JSON.stringify(data.bookingStatus));
        data.bookingStatus = status;
        this.tableData = this.tempTableData.filter((item: any) => item.bookingStatus == oldStatus);
        this.totalData = this.tableData.length;
        if (status === "Received")
          this.goToChecklist();
        // this.openOtpVerification(data, status);
      }
    }, () => { });
    return;
  }

  openOtpVerification(data: any, status: any) {
    const modalRef = this.modalService.open(OtpVerificationModalComponent, {
      centered: true
    });
    modalRef.result.then((res: any) => {
      if (res.confirmed) {
        console.log("status >>>>", status);
        const oldStatus = JSON.parse(JSON.stringify(data.bookingStatus));
        data.bookingStatus = status;
        this.tableData = this.tempTableData.filter((item: any) => item.bookingStatus == oldStatus);
        this.totalData = this.tableData.length;
        this.openVerificationSuccess(status);
      }
    }, () => {
    });
  }

  openVerificationSuccess(status: any) {
    const modalRef = this.modalService.open(VerificationSuccessModalComponent, {
      centered: true
    });
    modalRef.componentInstance.title = "Booking status updated successfully.";
    modalRef.result.then((res: any) => {

    }, () => {
    });
  }

}
