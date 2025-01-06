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
import { MatDialog } from '@angular/material/dialog';
import { BookingDetailsModalComponent } from '../../../shared/components/comman/modal/booking-modals/booking-details-modal/booking-details-modal.component';
import { PaymentService } from '../../../shared/services/payment.service';
import { InvoiceModalComponent } from '../../../shared/components/comman/modal/payment-modals/invoice-modal/invoice-modal.component';
import { GlobalService } from '../../../shared/services/global.service';
import { ReviewService } from '../../../shared/services/review.service';
import { BarRating, BarRatingModule } from 'ngx-bar-rating';
import { WriteReviewModalComponent } from '../../../shared/components/comman/modal/booking-modals/write-review-modal/write-review-modal.component';
import { RolePermissionService } from '../../../shared/services/rolepermission.service';

@Component({
  selector: 'app-user-reviews',
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
    BarRating
  ],
  templateUrl: './user-reviews.component.html',
  styleUrl: './user-reviews.component.scss'
})
export class UserReviewsComponent {

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
  public activeTab = 'car_review';
  activeTabName: any = '';

  booktabs = [
    { title: "Car Reviews", value: "car_reviews" },
    { title: "Driver Reviews", value: "driver_reviews" },
  ];

  constructor(
    // private data: DataService,
    private router: Router,
    private route: ActivatedRoute,
    private toast: ToastService,
    private reviewService: ReviewService,
    public getPer: RolePermissionService,
    public cabService: CabService,
    public gs: GlobalService,
    private dialog: MatDialog,
    private modalService: NgbModal,

  ) {
    this.route.queryParams.subscribe((params) => {
      this.activeTab = params['activeTab'] ? params['activeTab'] : "car_reviews";
      this.getTableData(this.activeTab);
      // this.getTableData();
    })

    this.getPer.actionPermissions = {

    }
  }

  getTableData(type: any) {
    let tabName = this.booktabs.find((item: any) => item.value === type)?.title;
    this.activeTabName = tabName;
    this.reviewService.getUserReview().subscribe((apiRes: apiResultFormat) => {
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

  changeBookTab(item: any) {
    this.activeTab = item.value;
    let params = {
      activeTab: this.activeTab,
    }
    this.getTableData(this.activeTab);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: "merge"
    });
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

  onEdit(item: any) {
    const modalRef = this.modalService.open(WriteReviewModalComponent, {
      // size: 'lg'
    });
    modalRef.componentInstance.singleDetails = item;
    modalRef.componentInstance.isEdit = true;
    modalRef.result.then((res: any) => {

      item.review = res.form.review;
      item.rating = res.form.rating;
    }, () => {
    });
  }

  async onDelete(index: any) {
    const modalRef = this.modalService.open(DeleteModalComponent, {
      centered: true,
    });
    modalRef.result.then((res: any) => {
      if (res.confirmed) {
        this.tableData.splice(index, 1);
        this.toast.successToastr("Deleted successfully");
      }
    }, () => {
    });
  }

}
