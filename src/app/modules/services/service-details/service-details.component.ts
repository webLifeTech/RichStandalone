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

@Component({
  selector: 'app-service-details',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatTabsModule,
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

  constructor(
    private modalService: NgbModal,
    private reviewService: ReviewService,
    private vendorService: VendorServService,
    public gs: GlobalService,
  ) {
    this.getReview();
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const d = new Date();
    this.selectedDay = weekday[d.getUTCDay()];
    console.log("this.selectedDay >>>>>", this.selectedDay);

  }

  ngOnInit() {
    this.get();
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
    this.reviewService.getUserReview().subscribe((apiRes: any) => {
      // this.totalData = apiRes.totalData;
      this.reviews = apiRes.data;
      console.log("this.reviews >>>>>>", this.reviews);

    });
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
}
