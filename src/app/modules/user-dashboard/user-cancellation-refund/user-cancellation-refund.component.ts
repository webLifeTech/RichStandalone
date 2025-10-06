import { Component, Input } from '@angular/core';
import { CabService } from '../../../shared/services/cab.service';
import { CommonModule } from '@angular/common';
import { CurrencySymbolPipe } from '../../../shared/pipe/currency.pipe';
import { ActivatedRoute } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
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
import { BookingDetailsModalComponent } from '../../../shared/components/comman/modal/booking-modals/booking-details-modal/booking-details-modal.component';
import { RefundApproveRejectModalComponent } from '../../../shared/components/comman/modal/booking-modals/refund-approve-reject-modal/refund-approve-reject-modal.component';

@Component({
  selector: 'app-user-cancellation-refund',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    NgxPaginationModule,
    MatMenuModule,
    MatButtonModule,
    CurrencySymbolPipe,
  ],
  templateUrl: './user-cancellation-refund.component.html',
  styleUrl: './user-cancellation-refund.component.scss'
})
export class UserCancellationRefundComponent {

  sortColumn: any = "";
  sortOrder: any = "DESC";
  public tableData: any = [];
  public searchDataValue = '';
  public pageSize = 10;
  public totalData = 0;
  public currentPage = 1;
  activeTab: any = "Refund";
  statusList: any = [];

  constructor(
    private route: ActivatedRoute,
    private paymentService: PaymentService,
    private adminService: AdminService,
    public cabService: CabService,
    public gs: GlobalService,
    private modalService: NgbModal,
    private toast: ToastService,

  ) {
    window.scrollTo({ top: 180, behavior: 'smooth' });
    this.route.queryParams.subscribe((params) => {
      this.getTableData();
      this.getMasterRefundStatus();
    })
  }

  getTableData() {
    const body = {
      "pageNumber": this.currentPage,
      "pagesize": this.pageSize,
      "sortColumn": this.sortColumn,
      "sortOrder": this.sortOrder,
      "globalSearch": this.searchDataValue?.trim() || ""
    };
    this.gs.isSpinnerShow = true;
    this.adminService.GetBookingRefundDetailsForAdmin(body).subscribe((response: any) => {
      this.gs.isSpinnerShow = false;
      console.log("response >>>>", response);
      this.tableData = response.refundDetails;
      this.totalData = response.viewModel?.totalCount;
    });
  }

  getMasterRefundStatus() {
    this.gs.isSpinnerShow = true;
    this.adminService.GetMasterRefundStatus().subscribe((response: any) => {
      this.gs.isSpinnerShow = false;
      this.statusList = response;
      console.log("GetMasterRefundStatus >>>>", response);
      // this.tableData = response.refundDetails;
      // this.totalData = response.viewModel?.totalCount;
    });
  }

  searchData() {
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

  changeBookTab(row: any) {
    this.activeTab = row.name;
    this.currentPage = 1;
    this.getTableData();
  }

  changeStatus(data: any, statusObj: any) {
    const modalRef = this.modalService.open(ConfirmationModalComponent, {
      centered: true,
    });
    modalRef.componentInstance.title = "Are you sure you want to move to " + statusObj.code + " ?";
    modalRef.result.then((res: any) => {
      if (res.confirmed) {
        if (statusObj.id == 2) {
          this.updateBookingRefundStatus(data, statusObj);
        }
        if (statusObj.id == 3) {
          this.refundReject(data, statusObj);
        }
      }
    }, () => { });
    return;
  }

  refundReject(data: any, statusObj: any) {
    const modalRef = this.modalService.open(RefundApproveRejectModalComponent, {
      centered: true,
    });
    modalRef.result.then((res: any) => {
      if (res.confirmed) {
        statusObj.refund_rejected_reason = res.reason;
        this.updateBookingRefundStatus(data, statusObj);
      }
    });
  }

  updateBookingRefundStatus(data: any, statusObj: any) {
    let body = {
      "userId": this.gs.loggedInUserInfo.userId,
      "refundId": data.refundId,
      "refundStatus": statusObj.id,
      "rejectedReason": statusObj.refund_rejected_reason || null
    }
    this.adminService.UpdateBookingRefundStatus(body).subscribe((response: any) => {
      console.log("UpdateBookingRefundStatus >>>>", response);
      if (response && response.statusCode == "200") {
        this.toast.successToastr(response.message);
        this.getTableData();
      } else {
        this.toast.errorToastr(response.message);
      }
    })
  }

  onSort(column: any) {
    this.sortColumn = column;
    this.sortOrder = this.sortOrder === "DESC" ? "ASC" : "DESC";
    this.getTableData();
  }

  exportToExcel() {
    const body = {
      "pageNumber": 1,
      "pagesize": this.totalData,
      "sortColumn": this.sortColumn,
      "sortOrder": this.sortOrder,
      "globalSearch": this.searchDataValue?.trim() || ""
    };
    this.gs.isSpinnerShow = true;
    this.adminService.GetBookingRefundDetailsForAdmin(body).subscribe((response: any) => {
      this.gs.isSpinnerShow = false;

      let tableData = response.refundDetails;
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
      const refundStatus: any = {
        "Approved": "1FBC2F",
        "Pending": "FF9307",
        "Rejected": "FF0000",
        "Pending Disburse": "127384",
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
          "Reason": {
            ...style,
            value: tableData[i].cancellationReason || '-',
          },
          "Remark": {
            ...style,
            value: tableData[i].refundReason || '-',
          },
          "Requested Date": {
            ...style,
            value: tableData[i].requestedDate || '-',
          },
          "Refund Amount": {
            ...style,
            value: tableData[i].refundAmount || '-',
            font: { bold: true },
            alignment: { ...style.alignment, ...{ horizontal: 'right' } },
            isTotal: true,
          },
          "Status": {
            ...style,
            value: tableData[i].refundStatus || '-',
            font: { bold: true, color: { argb: refundStatus[tableData[i].refundStatus] } },
          },
        });
      }
      this.gs.exportToExcelCustom(finalData, "PaymentsRefund", "Payments Refund");
    });
  }
}
