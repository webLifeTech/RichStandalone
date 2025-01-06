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

@Component({
  selector: 'app-user-dashboard-booking',
  standalone: true,
  imports: [
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

  public activeTab = '';
  activeTabName: any = '';
  total_booking_amount: any = 1200;
  total_refunded_amount: any = 200;
  total_net_profit: any = 1000;
  editInfo: any = {};
  booktabs = [
    { title: "All Bookings", value: "all_bookings" },
    { title: "Upcoming", value: "upcoming" },
    { title: "Inprogress", value: "inprogress" },
    { title: "Completed", value: "completed" },
    { title: "Cancelled", value: "cancelled" }
  ]

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
      this.activeTab = params['activeTab'] ? params['activeTab'] : "all_bookings";
      this.getTableData(this.activeTab);
    })
  }

  getTableData(type: any) {
    let tabName = this.booktabs.find((item: any) => item.value === type)?.title;

    this.activeTabName = tabName;

    if (type === "all_bookings") {
      this.bookingService.getUserBookings().subscribe((apiRes: apiResultFormat) => {
        this.totalData = apiRes.totalData;
        this.tableData = apiRes.data;
      });
    }
    if (type === "upcoming") {
      this.bookingService.getUserBookingUpcoming().subscribe((apiRes: apiResultFormat) => {
        this.totalData = apiRes.totalData;
        this.tableData = apiRes.data;
      });
    }
    if (type === "inprogress") {
      this.bookingService.getUserBookingInprogress().subscribe((apiRes: apiResultFormat) => {
        this.totalData = apiRes.totalData;
        this.tableData = apiRes.data;
      });
    }
    if (type === "completed") {
      this.bookingService.getUserBookingComplete().subscribe((apiRes: apiResultFormat) => {
        this.totalData = apiRes.totalData;
        this.tableData = apiRes.data;
      });
    }
    if (type === "cancelled") {
      this.bookingService.getUserBookingCancelled().subscribe((apiRes: apiResultFormat) => {
        this.totalData = apiRes.totalData;
        this.tableData = apiRes.data;
      });
    }
  }

  // private getTableData(pageOption: pageSelection): void {
  //   this.bookingService.getUserBookings().subscribe((apiRes: apiResultFormat) => {
  //     this.tableData = [];
  //     this.serialNumberArray = [];
  //     this.totalData = apiRes.totalData;
  //     apiRes.data.map((res: userBookings, index: number) => {
  //       const serialNumber = index + 1;
  //       if (index >= pageOption.skip && serialNumber <= pageOption.limit) {
  //         res.id = serialNumber;
  //         this.tableData.push(res);
  //         this.serialNumberArray.push(serialNumber);
  //       }
  //     });
  //     // this.dataSource = new MatTableDataSource<userBookings>(
  //     //   this.tableData
  //     // );
  //     // this.pagination.calculatePageSize.next({
  //     //   totalData: this.totalData,
  //     //   pageSize: this.pageSize,
  //     //   tableData: this.tableData,
  //     //   serialNumberArray: this.serialNumberArray,
  //     // });
  //   });
  // }
  public searchData(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.tableData = this.dataSource.filteredData;
  }
  initChecked = false;

  changeBookTab(item: any) {
    // item.isSelected = true;
    this.activeTab = item.value;
    let params = {
      activeTab: this.activeTab
    }
    this.getTableData(this.activeTab);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: "merge"
    });
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
    modalRef.componentInstance.bookingDetails = item;
    modalRef.result.then((res: any) => {

    }, () => {
    });
  }

  bookingCancel(item: any) {
    const modalRef = this.modalService.open(BookingCancelModalComponent, {
      centered: true,
    });
    modalRef.componentInstance.bookingDetails = item;
    modalRef.result.then((res: any) => {
      if (res.confirmed) {
        item.reason = res.reason;
        item.status = "Cancelled";
      }

    }, () => {
    });
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

}
