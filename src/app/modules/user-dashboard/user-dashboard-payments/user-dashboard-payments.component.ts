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

@Component({
  selector: 'app-user-dashboard-payments',
  standalone: true,
  imports: [
    DeleteModalComponent,
    BookingDetailsModalComponent,

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

  public tableData: any = [];
  dataSource!: MatTableDataSource<userBookings>;
  public showFilter = false;
  public searchDataValue = '';
  public lastIndex = 0;
  public pageSize = 10;
  public totalData = 0;
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

  constructor(
    private route: ActivatedRoute,
    private paymentService: PaymentService,
    public cabService: CabService,
    public gs: GlobalService,
    private dialog: MatDialog,
    private modalService: NgbModal,

  ) {
    this.route.queryParams.subscribe((params) => {
      this.getTableData();
    })
  }

  getTableData() {
    // let tabName = this.booktabs.find((item: any) => item.value === type)?.title;
    // this.activeTabName = tabName;

    this.paymentService.getUserPayment().subscribe((apiRes: apiResultFormat) => {
      this.totalData = apiRes.totalData;
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


  onView(item: any) {
    const modalRef = this.modalService.open(InvoiceModalComponent, {
      size: 'xl'
    });
    modalRef.result.then((res: any) => {

    }, () => {
    });
    this.editInfo = item;
  }

  onEdit(item: any, index: any) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async onDelete(index: any, content: any) {
    this.modalService.open(content, { centered: true });
  }

}
