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
import { BookingService } from '../../../shared/services/booking.service';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { AlertService } from '../../../shared/services/alert.service';
import { ToastService } from '../../../shared/services/toast.service';
import { DeleteModalComponent } from '../../../shared/components/comman/modal/booking-modals/delete-modal/delete-modal.component';
import { CabCardViewComponent } from '../../../shared/components/comman/booking/cab-card-view/cab-card-view.component';
import { GlobalService } from '../../../shared/services/global.service';
import { CheckAvailabilityModalComponent } from '../../../shared/components/comman/modal/wishlist-modals/check-availability-modal/check-availability-modal.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';

@Component({
  selector: 'app-user-wishlist',
  standalone: true,
  imports: [
    DeleteModalComponent,
    CabCardViewComponent,

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
  templateUrl: './user-wishlist.component.html',
  styleUrl: './user-wishlist.component.scss'
})
export class UserWishlistComponent {

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
  type: any = "car";

  cardLists: any = [];
  myWishlist: any = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toast: ToastService,
    public cabService: CabService,
    private gs: GlobalService,
    private modalService: NgbModal,

  ) {
    if (this.gs.loggedInUserInfo['role'] === 'user_2' || this.gs.loggedInUserInfo['role'] === 'user_3') {
      this.type = "driver";
    }
    this.route.queryParams.subscribe((params) => {
      this.getTableData();
    })
  }

  getTableData() {
    this.myWishlist = this.gs.getMyWishlistData();
    console.log("this.myWishlist >>>>>>", this.myWishlist);
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

  getMaskedCardNumber(fullCreditCardNumber: any): string {
    const length = fullCreditCardNumber.length;
    const last4Digits = fullCreditCardNumber.slice(length - 4);
    const maskedDigits = '*'.repeat(length - 4);
    return maskedDigits + last4Digits;
  }

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

  //
  onCheckAvailability(item: any) {
    const modalRef = this.modalService.open(CheckAvailabilityModalComponent, {
      size: 'md'
    });
    modalRef.componentInstance.singleDetails = item;
    modalRef.componentInstance.type = this.type;
    modalRef.componentInstance.isEdit = true;
    modalRef.result.then((res: any) => {

    }, () => {
    });
  }

}
