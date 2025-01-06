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

  public tableData: any = [];
  dataSource!: MatTableDataSource<userBookings>;
  public showFilter = false;
  public searchDataValue = '';
  public lastIndex = 0;
  public pageSize = 10;
  public totalRecord = 0;
  public skip = 0;
  public limit: number = this.pageSize;
  public pageIndex = 0;
  public serialNumberArray: Array<number> = [];
  public currentPage = 1;
  public pageNumberArray: Array<number> = [];
  public pageSelection = [];
  public totalPages = 0;

  total_booking_amount: any = 1200;
  total_refunded_amount: any = 200;
  total_net_profit: any = 1000;
  editInfo: any = {};

  cardLists: any = [];

  constructor(
    // private data: DataService,
    private router: Router,
    private route: ActivatedRoute,
    private pagination: PaginationService,
    private toast: ToastService,
    private alert: AlertService,
    private paymentService: PaymentService,
    public cabService: CabService,
    private dialog: MatDialog,
    private modalService: NgbModal,
    public gs: GlobalService,

  ) {
    this.route.queryParams.subscribe((params) => {
      this.getTableData();
    })
    this.getCards();
  }

  async getCards() {
    this.cardLists = [
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
    for (let i in this.cardLists) {
      this.cardLists[i].hiddenNumber = await this.getMaskedCardNumber(this.cardLists[i].card_number);
    }
  }

  getTableData() {
    this.paymentService.getuserWallet().subscribe((apiRes: apiResultFormat) => {
      this.totalRecord = apiRes.totalData;
      this.tableData = apiRes.data;
    });
  }

  public searchData(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.tableData = this.dataSource.filteredData;
  }
  initChecked = false;

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

  addPayment() {
    const modalRef = this.modalService.open(AddPaymentModalComponent, {
      size: 'md'
    });
    modalRef.result.then((res: any) => {

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

  onView(item: any) {
    const modalRef = this.modalService.open(InvoiceModalComponent, {
      size: 'xl'
    });
    modalRef.result.then((res: any) => {

    }, () => {
    });
    this.editInfo = item;
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

  // async onDelete(index: any, content: any) {
  //   this.modalService.open(content, { centered: true });
  // }

}
