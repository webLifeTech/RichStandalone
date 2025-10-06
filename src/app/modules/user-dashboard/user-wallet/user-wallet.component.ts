import { Component, Input } from '@angular/core';
import { booking } from '../../../shared/interface/pages';
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
import { AlertService } from '../../../shared/services/alert.service';
import { ToastService } from '../../../shared/services/toast.service';
import { DeleteModalComponent } from '../../../shared/components/comman/modal/booking-modals/delete-modal/delete-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { PaymentService } from '../../../shared/services/payment.service';
import { InvoiceModalComponent } from '../../../shared/components/comman/modal/payment-modals/invoice-modal/invoice-modal.component';
import { AddPaymentModalComponent } from '../../../shared/components/comman/modal/payment-modals/add-payment-modal/add-payment-modal.component';
import { AddCardModalComponent } from '../../../shared/components/comman/modal/payment-modals/add-card-modal/add-card-modal.component';
import { GlobalService } from '../../../shared/services/global.service';
import { WalletService } from '../../../shared/services/wallet.service';

@Component({
  selector: 'app-user-wallet',
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
  templateUrl: './user-wallet.component.html',
  styleUrl: './user-wallet.component.scss'
})
export class UserWalletComponent {

  sortColumn: any = "";
  sortOrder: any = "DESC"; // ASC
  public tableData: any = [];
  public searchDataValue = '';
  public pageSize = 10;
  public totalData = 0;
  public currentPage = 1;

  walletDetails: any = {};

  cardLists: any = [
    {
      "image": "assets/icons/payment/wallet-01.svg",
      "card_number": "3210 7836 4432 3412",
      "balance": 3000,
      "status": "Active",
      "name_on_card": "Jone Doe",
      "cvv": "337",
      "expiry_date": "12/29",
      "rememberme": true,
    },
    {
      "image": "assets/icons/payment/wallet-02.svg",
      "card_number": "7847 8563 3211 3478",
      "balance": 2300,
      "status": "Active",
      "name_on_card": "Jone Doe",
      "cvv": "553",
      "expiry_date": "02/41",
      "rememberme": true,
    },
    {
      "image": "assets/icons/payment/wallet-03.svg",
      "card_number": "4710 8563 3211 3464",
      "balance": 1800,
      "status": "Active",
      "name_on_card": "Jone Doe",
      "cvv": "764",
      "expiry_date": "02/41",
      "rememberme": true,
    },
  ];

  constructor(
    private toast: ToastService,
    public cabService: CabService,
    private dialog: MatDialog,
    private modalService: NgbModal,
    public gs: GlobalService,
    public walletService: WalletService,

  ) {
    // this.getWalletDetails();
    this.getWalletDetails();
    this.getCards();
  }



  async getCards() {
    for (let i in this.cardLists) {
      this.cardLists[i].hiddenNumber = await this.getMaskedCardNumber(this.cardLists[i].card_number);
    }
  }

  getWalletDetails() {
    const body = {
      "userId": this.gs.loggedInUserInfo.userId,
      "pageNumber": this.currentPage,
      "pagesize": this.pageSize,
      "sortColumn": this.sortColumn,
      "sortOrder": this.sortOrder,
      "globalSearch": this.searchDataValue?.trim() || "",
      "paymentMethod": null,
      "paymentType": null,
      "transactionType": null,
      "paymentRefNumber": null,
      "paymentStatus": null,
      "paymentDate": null,
    }
    this.gs.isSpinnerShow = true;
    this.walletService.GetAllWalletPayments(body).subscribe((response: any) => {
      console.log("GetAllWalletPayments >>>>", response);
      this.gs.isSpinnerShow = false;
      if (response && response.response && response.response.statusCode == "200") {
        this.tableData = response.walletPaymentDetails?.walletpaymentMatches;
        this.totalData = response.viewModel?.totalCount;
        this.walletDetails = response.walletPaymentDetails?.walletDetails;
      }
    })
  }

  searchData() {
    this.getWalletDetails();
  }

  pageChanged(event: any) {
    this.currentPage = event;
    this.getWalletDetails()
  }

  openImportantNoticeDialog(): void {
    this.dialog.open(DeleteModalComponent, {
      width: '100%',
      data: {}
    });
  }

  getMaskedCardNumber(fullCreditCardNumber: any): string {
    const length = fullCreditCardNumber.length;
    const last4Digits = fullCreditCardNumber.slice(length - 4);
    const maskedDigits = '*'.repeat(length - 4);
    return maskedDigits + last4Digits;
  }

  paymentAction(type: any) {
    const modalRef = this.modalService.open(AddPaymentModalComponent, {
      size: 'md'
    });
    modalRef.componentInstance.paymentType = type;
    modalRef.componentInstance.walletId = this.walletDetails.walletId;
    modalRef.result.then((res: any) => {
      console.log("res >>>>", res);
      if (res.confirmed) {
        this.getWalletDetails();
      }
    }, () => {
    });
  }

  addCard() {
    const modalRef = this.modalService.open(AddCardModalComponent, {
      size: 'lg'
    });
    modalRef.componentInstance.isAdd = true;
    modalRef.result.then((res: any) => {

    }, () => {
    });
  }


  //
  onEdit(item: any) {
    const modalRef = this.modalService.open(AddCardModalComponent, {
      size: 'lg'
    });
    modalRef.componentInstance.singleDetails = item;
    modalRef.componentInstance.isEdit = true;
    modalRef.result.then((res: any) => {

    }, () => {
    });
  }
  //
  async onDelete(index: any) {
    const modalRef = this.modalService.open(DeleteModalComponent, {
      centered: true,
    });
    modalRef.result.then((res: any) => {
      if (res.confirmed) {
        this.cardLists.splice(index, 1);
        this.toast.successToastr("Deleted successfully");
      }
    }, () => {
    });
  }

  onSort(column: any) {
    this.sortColumn = column;
    this.sortOrder = this.sortOrder === "DESC" ? "ASC" : "DESC";
    this.getWalletDetails();
  }

  exportToExcel() {
    const body = {
      "userId": this.gs.loggedInUserInfo.userId,
      "pageNumber": 1,
      "pagesize": this.totalData,
      "sortColumn": this.sortColumn,
      "sortOrder": this.sortOrder,
      "globalSearch": this.searchDataValue?.trim() || "",
      "paymentMethod": null,
      "paymentType": null,
      "transactionType": null,
      "paymentRefNumber": null,
      "paymentStatus": null,
      "paymentDate": null,
    }
    this.gs.isSpinnerShow = true;
    this.walletService.GetAllWalletPayments(body).subscribe((response: any) => {
      this.gs.isSpinnerShow = false;
      let tableData = response.walletPaymentDetails?.walletpaymentMatches;
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
          "Reference Number": {
            ...style,
            value: tableData[i].paymentReferenceNumber || '-',
          },
          "Transaction Type": {
            ...style,
            value: 'Amount - ' + tableData[i].transactionType || '-',
            font: { bold: true, color: { argb: tableData[i].transactionType === 'CREDIT' ? "008000" : "FF0000" } },
          },
          "Amount": {
            ...style,
            value: (tableData[i].transactionType === 'CREDIT' ? '+' : '-') + tableData[i].amount || '-',
            font: { bold: true, color: { argb: tableData[i].transactionType === 'CREDIT' ? "008000" : "FF0000" } },
            alignment: { ...style.alignment, ...{ horizontal: 'right' } },
            isTotal: true,
          },
          "Payment Mode": {
            ...style,
            value: tableData[i].paymentMethod || '-',
          },
          "Remarks": {
            ...style,
            value: tableData[i].remarks || '-',
          },
          "Date": {
            ...style,
            value: tableData[i].createdDate || '-',
          },
          "Status": {
            ...style,
            value: tableData[i].status || '-',
          },
        });
      }

      this.gs.exportToExcelCustom(finalData, "WalletHistory", "Wallet Usage History");
      // this.gs.exportToExcel(finalData, "WalletHistory", "Wallet Usage History");

      // const data = [
      //   {
      //     SL: { value: 1 },
      //     "Reference Number": { value: "WT00000023" },
      //     "Transaction Type": {
      //       value: "Amount - DEBIT",
      //       font: { bold: true, color: { argb: "FF0000" } },
      //     },
      //     Amount: {
      //       value: "-36.7",
      //       font: { bold: true, color: { argb: "FF0000" } },
      //       isTotal: true,
      //     },
      //     "Payment Mode": { value: "Wallet" },
      //     Remarks: { value: "Booking Payment" },
      //     Date: { value: "09/26/2025" },
      //     Status: {
      //       value: "Active",
      //       font: { bold: true, color: { argb: "008000" } },
      //     },
      //   },
      //   {
      //     SL: { value: 2 },
      //     "Reference Number": { value: "12743" },
      //     "Transaction Type": {
      //       value: "Amount - CREDIT",
      //       font: { bold: true, color: { argb: "008000" } },
      //     },
      //     Amount: {
      //       value: "+29",
      //       font: { bold: true, color: { argb: "008000" } },
      //       isTotal: true,
      //     },
      //     "Payment Mode": { value: "ACH" },
      //     Remarks: { value: "Booking Payment" },
      //     Date: { value: "09/25/2025" },
      //     Status: { value: "Active" },
      //   },
      // ];
    });
  }
}
