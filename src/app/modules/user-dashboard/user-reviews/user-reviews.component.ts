import { Component, Input } from '@angular/core';
import { CabService } from '../../../shared/services/cab.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgxPaginationModule, PaginationService } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { ToastService } from '../../../shared/services/toast.service';
import { MatDialog } from '@angular/material/dialog';
import { GlobalService } from '../../../shared/services/global.service';
import { ReviewService } from '../../../shared/services/review.service';
import { BarRating } from 'ngx-bar-rating';
import { WriteReviewModalComponent } from '../../../shared/components/comman/modal/booking-modals/write-review-modal/write-review-modal.component';
import { RolePermissionService } from '../../../shared/services/rolepermission.service';

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
    BarRating
  ],
  templateUrl: './user-reviews.component.html',
  styleUrl: './user-reviews.component.scss'
})
export class UserReviewsComponent {

  public tableData: any = [];
  public searchDataValue = '';
  public pageSize = 10;
  public totalData = 0;
  public currentPage = 1;


  editInfo: any = {};
  public activeTab = 'i_gave';
  activeTabName: any = '';

  booktabs: any = [
    { title: "I Gave Review", value: "i_gave" }
  ];

  sortColumn: any = "bookingReferenceNumber";
  sortOrder: any = "DESC";

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
    if (gs.loggedInUserInfo['role'] === 'user_2' || gs.loggedInUserInfo['role'] === 'user_3') {
      this.booktabs.push(
        { title: "My Car Review", value: "my_car" }
      )
    } else {
      this.booktabs.push(
        { title: "My Review", value: "my_driver" }
      )
    }
    this.route.queryParams.subscribe((params) => {
      this.activeTab = params['activeTab'] ? params['activeTab'] : "i_gave";
      this.getTableData();
    })
  }

  getTableData() {
    console.log("this.activeTab >>>>", this.activeTab);

    // let tabName = this.booktabs.find((item: any) => item.value === this.activeTab)?.title;
    // this.activeTabName = tabName;
    // this.reviewService.getUserReview().subscribe((apiRes: apiResultFormat) => {
    //   this.totalData = apiRes.totalData;
    //   this.tableData = apiRes.data;
    // });

    let Body = {
      "userId": this.gs.loggedInUserInfo.userId, // "c5c9b193-64ec-46ae-b1a1-f646bc1e0933" // this.gs.loggedInUserInfo.userId
      "riskType": null,
      "reviewType": this.activeTab == 'i_gave' ? "Given" : "Received",
      "pageNumber": this.currentPage,
      "pagesize": this.pageSize,
      "globalSearch": this.searchDataValue || "",
      "sortColumn": this.sortColumn,
      "sortOrder": this.sortOrder,
    };

    // if (this.activeTab == 'i_gave') {
    this.gs.isSpinnerShow = true;
    this.reviewService.GetAllRiskReviews(Body).subscribe((res: any) => {
      console.log("GetAllRiskReviews >>>>>", res);
      this.gs.isSpinnerShow = false;
      if (res.responseResultDtos && res.responseResultDtos.statusCode == "200") {
        this.tableData = res.reviewsLists;
        this.totalData = res.viewModel.totalCount;
      } else {
        this.tableData = [];
        this.totalData = 0;
      }
    }, (err: any) => {
      this.toast.errorToastr("Something went wrong");
      this.gs.isSpinnerShow = false;
    })
    // } else {
    // this.gs.isSpinnerShow = true;
    // this.reviewService.GetUserReviews(Body).subscribe((res: any) => {
    //   console.log("GetUserReviews >>>>>", res);
    //   this.gs.isSpinnerShow = false;
    //   if (res && res.statusCode == "200") {
    //     this.tableData = res.userReviewsLists;
    //     this.totalData = res.viewModel.totalCount;
    //   } else {
    //     this.tableData = [];
    //     this.totalData = 0;
    //   }
    // }, (err: any) => {
    //   this.toast.errorToastr("Something went wrong");
    //   this.gs.isSpinnerShow = false;
    // })
    // }
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

}
