import { Component, Input } from '@angular/core';
import { CabService } from '../../../shared/services/cab.service';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { ToastService } from '../../../shared/services/toast.service';
import { GlobalService } from '../../../shared/services/global.service';
import { ReviewService } from '../../../shared/services/review.service';
import { BarRating } from 'ngx-bar-rating';
import { WriteReviewModalComponent } from '../../../shared/components/comman/modal/booking-modals/write-review-modal/write-review-modal.component';
import { RolePermissionService } from '../../../shared/services/rolepermission.service';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';

@Component({
  selector: 'app-user-reviews',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    NgxPaginationModule,
    MatMenuModule,
    MatButtonModule,
    BarRating,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
  ],
  providers: [DatePipe],
  templateUrl: './user-reviews.component.html',
  styleUrl: './user-reviews.component.scss'
})
export class UserReviewsComponent {

  public tableData: any = [];
  public searchDataValue = '';
  public pageSize = 10;
  public totalData = 0;
  public currentPage = 1;
  dateTimeRange: any = "";

  editInfo: any = {};
  public activeTab = 'i_gave';
  activeTabName: any = '';

  booktabs: any = [
    // { title: "I Gave Review", value: "i_gave" }
  ];

  sortColumn: any = "bookingReferenceNumber";
  sortOrder: any = "DESC";

  constructor(
    private route: ActivatedRoute,
    private toast: ToastService,
    private reviewService: ReviewService,
    public getPer: RolePermissionService,
    public cabService: CabService,
    public gs: GlobalService,
    private modalService: NgbModal,
    private datePipe: DatePipe,
  ) {
    if (this.gs.loggedInUserInfo['role'] === 'user') {
      this.booktabs = [
        { title: "My Review of the Car Experience", value: "i_gave" },
        { title: "Reviews from Car Owners", value: "my_driver" }
      ]
    }
    if (this.gs.loggedInUserInfo['role'] === 'user_2') {
      this.booktabs = [
        { title: "My Review of the Driver's Experience", value: "i_gave" },
        { title: "Reviews from Drivers", value: "my_car" }
      ]
    }
    if (this.gs.loggedInUserInfo['role'] === 'user_3') {
      this.booktabs = [
        { title: "My Review of the Driver's Performance", value: "i_gave" },
        { title: "Reviews from Drivers", value: "my_car" }
      ]
    }
    if (this.gs.loggedInUserInfo['role'] === 'user_4') {
      this.booktabs = [
        { title: "My Review of the Driver's Service", value: "i_gave" },
        { title: "Reviews from Car Owners", value: "my_driver" }
      ]
    }
    this.route.queryParams.subscribe((params) => {
      this.activeTab = params['activeTab'] ? params['activeTab'] : "i_gave";
      this.getTableData();
    })
  }

  getTableData() {

    const { startDate, endDate } = this.gs.normalizeDateRange(this.dateTimeRange[0], this.dateTimeRange[1]);
    let Body = {
      "userId": this.gs.loggedInUserInfo.userId, // "c5c9b193-64ec-46ae-b1a1-f646bc1e0933" // this.gs.loggedInUserInfo.userId
      "riskType": null,
      "reviewType": this.activeTab == 'i_gave' ? "Given" : "Received",
      "pageNumber": this.currentPage,
      "pagesize": this.pageSize,
      "globalSearch": this.searchDataValue?.trim() || "",
      "sortColumn": this.sortColumn,
      "sortOrder": this.sortOrder,
      "startDate": startDate,
      "endDate": endDate,
    };

    this.gs.isSpinnerShow = true;
    this.reviewService.GetAllRiskReviews(Body).subscribe((res: any) => {
      this.gs.isSpinnerShow = false;
      if (res.response && res.response.statusCode == "200") {
        this.tableData = res.gridList;
        this.totalData = res.viewModel.totalCount;
      } else {
        this.tableData = [];
        this.totalData = 0;
      }
    }, (err: any) => {
      this.toast.errorToastr("Something went wrong");
      this.gs.isSpinnerShow = false;
    })
  }

  searchData() {
    this.getTableData();
  }

  onSort(column: any) {
    this.sortColumn = column;
    this.sortOrder = this.sortOrder === "DESC" ? "ASC" : "DESC";
    this.getTableData();
  }

  changeBookTab(item: any) {
    this.activeTab = item.value;
    this.getTableData();
  }

  pageChanged(event: any) {
    this.currentPage = event;
    this.getTableData();
  }

  onEdit(item: any) {
    const modalRef = this.modalService.open(WriteReviewModalComponent, {
      // size: 'lg'
    });
    modalRef.componentInstance.singleDetails = item;
    modalRef.result.then((res: any) => {
      if (res.confirmed) {
        this.getTableData();
      }
    });
  }

  transformDate(date: any, format: any) {
    return this.datePipe.transform(date, format);
  }

}
