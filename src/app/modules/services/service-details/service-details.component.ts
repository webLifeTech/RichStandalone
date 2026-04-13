import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EnquiriesModalComponent } from '../../../shared/components/comman/modal/enquiries-modal/enquiries-modal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { ReviewService } from '../../../shared/services/review.service';
import { VendorServService } from '../../../shared/services/vendor-service.service';
import { GlobalService } from '../../../shared/services/global.service';
import { WriteReviewModalComponent } from '../../../shared/components/comman/modal/booking-modals/write-review-modal/write-review-modal.component';
import { ToastService } from '../../../shared/services/toast.service';
import { BarRating } from 'ngx-bar-rating';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-service-details',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatTabsModule,
    BarRating,
    NgxPaginationModule,
  ],
  templateUrl: './service-details.component.html',
  styleUrl: './service-details.component.scss'
})
export class ServiceDetailsComponent {
  @Input() singleDetailInfo: any = {};
  @Output() backAction = new EventEmitter<any>();

  bg_image = 'assets/images/cab/breadcrumb.jpg';

  days = [
    { name: 'Monday', hours: '9:30 am–7 pm' },
    { name: 'Tuesday', hours: '9:30 am–7 pm' },
    { name: 'Wednesday', hours: '9:30 am–7 pm' },
    { name: 'Thursday', hours: '9:30 am–7 pm' },
    { name: 'Friday', hours: '9:30 am–7 pm' },
    { name: 'Saturday', hours: '9:30 am–7 pm' },
    { name: 'Sunday', hours: 'Closed' },
  ];

  reviews: any = [];
  selectedDay = '';
  fullStars = Array(5).fill(0);
  public tableData: any = [];
  public searchDataValue = '';
  sortColumn: any = "";
  sortOrder: any = "DESC";
  pageSize: any = 5;
  totalData: any = 0;
  currentPage: any = 1;
  selfReviewData: any = {};

  constructor(
    private modalService: NgbModal,
    private reviewService: ReviewService,
    private vendorService: VendorServService,
    private toast: ToastService,
    public gs: GlobalService,
  ) {
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const d = new Date();
    this.selectedDay = weekday[d.getUTCDay()];
    console.log("this.selectedDay >>>>>", this.selectedDay);

  }

  ngOnInit() {
    this.get();
    this.getReview();
  }

  get() {
    console.log("provider >>>>>>", this.singleDetailInfo);

    this.gs.isSpinnerShow = true;
    this.vendorService.GetProviderDetailsByProviderId({
      providerId: this.singleDetailInfo.providerId
    }).subscribe((res: any) => {
      console.log("res >>>>>>>", JSON.parse(res));
      this.singleDetailInfo = { ...this.singleDetailInfo, ...JSON.parse(res) }
      console.log("this.singleDetailInfo >>>>>>>", this.singleDetailInfo);
      this.gs.isSpinnerShow = false;
      if (res && res.length) {
        // this.totalData = res.length;
        // this.tableData = res;
        // this.enquiries = res;
      }
    })
  }

  getReview() {
    const body = {
      "providerUserId": this.singleDetailInfo.userId,
      "loginUserId": this.gs.loggedInUserInfo.userId,
      "pageNumber": this.currentPage,
      "pagesize": this.pageSize,
      "globalSearch": this.searchDataValue?.trim() || "",
      "sortColumn": this.sortColumn,
      "sortOrder": this.sortOrder,
    }

    this.gs.isSpinnerShow = true;
    this.reviewService.GetAllProviderRiskReviews(body).subscribe((res: any) => {
      this.gs.isSpinnerShow = false;
      if (res.response && res.response.statusCode == "200") {
        this.tableData = res.gridList;
        this.totalData = res?.viewModel?.totalCount || 0;
        this.selfReviewData = res.loginUserDetails ? JSON.parse(res.loginUserDetails) : {};
      }
    })
    // this.reviewService.getUserReview().subscribe((apiRes: any) => {
    //   // this.totalData = apiRes.totalData;
    //   this.reviews = apiRes.data;
    //   console.log("this.reviews >>>>>>", this.reviews);

    // });
  }

  openEnquirieModal(providerDetails: any) {
    const modalRef = this.modalService.open(EnquiriesModalComponent, {
      centered: true,
      size: 'lg'
    });
    modalRef.componentInstance.providerDetails = providerDetails;
    modalRef.componentInstance.searchDetails = this.singleDetailInfo.categoryInfo;
    modalRef.result.then((res: any) => {
      if (res.confirmed) {
      }
    }, () => {
    });
  }

  back() {
    this.backAction.emit(true);
  }

  writeReview() {
    const modalRef = this.modalService.open(WriteReviewModalComponent, {
      // centered: true,
    });
    modalRef.componentInstance.singleDetails = this.singleDetailInfo;
    modalRef.componentInstance.selfReviewData = this.selfReviewData;
    modalRef.componentInstance.type = "service";
    modalRef.result.then((res: any) => {
      if (res.confirmed) {
        this.gs.isSpinnerShow = true;
        const body = {
          "providerUserId": this.singleDetailInfo.userId,
          "loginUserId": this.gs.loggedInUserInfo.userId,
          "providerId": this.singleDetailInfo.providerId,
          "reviewId": this.selfReviewData.reviewId || 0,
          "rating": res.review.rating,
          "review": res.review.ratingText
        }
        this.reviewService.ProviderRiskReview(body).subscribe((res: any) => {
          this.gs.isSpinnerShow = false;
          if (res && res.statusCode == "200") {
            this.getReview();
            this.toast.successToastr(res.message);
          } else {
            this.toast.errorToastr(res.message);
          }
        })
      }
    }, () => {
    });
  }

  setPage(page: number) {
    this.currentPage = page;
    this.getReview();
  }


}
