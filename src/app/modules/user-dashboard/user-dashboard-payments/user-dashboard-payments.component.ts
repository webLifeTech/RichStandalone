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
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { DeleteModalComponent } from '../../../shared/components/comman/modal/booking-modals/delete-modal/delete-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { BookingDetailsModalComponent } from '../../../shared/components/comman/modal/booking-modals/booking-details-modal/booking-details-modal.component';
import { PaymentService } from '../../../shared/services/payment.service';
import { InvoiceModalComponent } from '../../../shared/components/comman/modal/payment-modals/invoice-modal/invoice-modal.component';
import { GlobalService } from '../../../shared/services/global.service';
import { ConfirmationModalComponent } from '../../../shared/components/comman/modal/confirmation-modal/confirmation-modal.component';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-user-dashboard-payments',
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
  templateUrl: './user-dashboard-payments.component.html',
  styleUrl: './user-dashboard-payments.component.scss'
})
export class UserDashboardPaymentsComponent {

  sortColumn: any = "CreatedDate";
  sortOrder: any = "DESC";
  public tableData: any = [];
  public searchDataValue = '';
  public pageSize = 10;
  public totalData = 0;
  public currentPage = 1;

  tabs: any = [
    { "name": "All Payments", "value": "All Payments" },
    { "name": "Pending Confirmation", "value": "Pending Confirm" },
    { "name": "Pending Disbursement", "value": "Pending Disburse" },
    { "name": "Cleared", "value": "Cleared" },
  ]
  activeTab: any = "";
  tempTableData: any = [];

  constructor(
    private route: ActivatedRoute,
    private paymentService: PaymentService,
    public cabService: CabService,
    public gs: GlobalService,
    private dialog: MatDialog,
    private modalService: NgbModal,
    private toast: ToastService,

  ) {
    window.scrollTo({ top: 180, behavior: 'smooth' });
    this.route.queryParams.subscribe((params) => {
      this.activeTab = params['activeTab'] ? params['activeTab'] : "All Payments";
      this.getTableData();
    })
  }

  getTableData() {
    // this.paymentService.getUserPayment().subscribe((apiRes: apiResultFormat) => {
    //   this.totalData = apiRes.totalData;
    //   this.tableData = apiRes.data;
    // });

    const body = {
      "userId": this.gs.loggedInUserInfo.userId,
      "pageNumber": this.currentPage,
      "pagesize": this.pageSize,
      "sortColumn": this.sortColumn,
      "sortOrder": this.sortOrder,
      "paymentMethod": null,
      "paymentType": null,
      "transactionType": null,
    };
    this.gs.isSpinnerShow = true;
    this.paymentService.GetAllBookingPayments(body).subscribe((response: any) => {
      this.gs.isSpinnerShow = false;
      this.tableData = response.bookingpaymentMatches;
      this.totalData = response.viewModel?.totalCount;

      this.paymentService.getCryptoPaymentTxnByIds({
        arrTxn: this.gs.loggedInUserInfo?.cryptoTransactions
      }).subscribe((pRes: any) => {
        this.gs.isSpinnerShow = false;
        if (pRes.status == 200) {
          let cryptoPaymentTxn = pRes.data;
          for (let i in cryptoPaymentTxn) {
            if (this.gs.loggedInUserInfo?.cryptoTransactions && this.gs.loggedInUserInfo.cryptoTransactions.indexOf(cryptoPaymentTxn[i].id) !== -1) {
              let tempObj = JSON.parse(JSON.stringify(this.tableData[0]));
              tempObj.paymentID = cryptoPaymentTxn[i].id;
              tempObj.total_amount = cryptoPaymentTxn[i].amountf;
              tempObj.status = cryptoPaymentTxn[i].status_text;
              tempObj.mode = `Crypto ${cryptoPaymentTxn[i].type} (${cryptoPaymentTxn[i].coin})`;
              this.tableData.unshift(tempObj);
            }
          }
          this.totalData = this.tableData.length;
        }
      });
    });
  }

  public searchData(value: string): void {

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
      if (response && response.responseResultDtos && response.responseResultDtos.statusCode == "200") {
        const modalRef = this.modalService.open(InvoiceModalComponent, {
          size: 'xl'
        });
        modalRef.componentInstance.invoiceDetails = response;
        // modalRef.result.then((res: any) => {}, () => {
        // });
      }
    })
  }

  changeBookTab(row: any) {
    this.activeTab = row.name;

    if (this.activeTab == "All Payments") {
      this.tableData = this.tempTableData;
      this.totalData = this.tableData.length;
    } else {
      this.tableData = this.tempTableData.filter((item: any) => item.admin_status == row.value);
      this.totalData = this.tableData.length;
    }
  }

  changeStatus(data: any, status: any) {
    const modalRef = this.modalService.open(ConfirmationModalComponent, {
      centered: true,
    });
    modalRef.componentInstance.title = "Are you sure you want to move to " + status + " ?";
    modalRef.result.then((res: any) => {
      if (res.confirmed) {
        const oldStatus = JSON.parse(JSON.stringify(data.admin_status));
        data.admin_status = status == "Confirm" ? "Pending Disburse" : "Cleared";
        this.tableData = this.tempTableData.filter((item: any) => item.admin_status == oldStatus);
        this.totalData = this.tableData.length;

        this.toast.successToastr("Payment status updated");
      }
    }, () => { });
    return;
  }
}
