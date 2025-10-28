import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BarRating } from 'ngx-bar-rating';
import { GlobalService } from '../../../../../services/global.service';
import { ToastService } from '../../../../../services/toast.service';
import { ReviewService } from '../../../../../services/review.service';

@Component({
  selector: 'app-write-review-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BarRating
  ],
  templateUrl: './write-review-modal.component.html',
  styleUrl: './write-review-modal.component.scss'
})
export class WriteReviewModalComponent {

  @Input() title: string;
  @Input() singleDetails: any = {};
  reason: any = "";
  form: any = {
    rating: 0,
    ratingText: ""
  };

  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    public gs: GlobalService,
    private toast: ToastService,
    private reviewService: ReviewService,
  ) { }

  ngOnInit() {
    if (this.singleDetails && this.singleDetails.id) {
      this.form.rating = this.singleDetails.rating;
      this.form.ratingText = this.singleDetails.ratingText;
    }
  }

  closeModal() {
    this.modalService.dismissAll();
  }
  onConfirm() {
    let Body = {
      "id": this.singleDetails.id || 0,
      "bookingId": this.singleDetails.bookingId,
      "userId": this.gs.loggedInUserInfo.userId,
      "rating": this.form.rating,
      "ratingText": this.form.ratingText
    };

    this.gs.isSpinnerShow = true;
    this.reviewService.InsertAndUpdateRiskReviews(Body).subscribe((res: any) => {
      this.gs.isSpinnerShow = false;
      if (res && res.statusCode == "200") {
        this.activeModal.close({ confirmed: true });
        this.toast.successToastr(res.message);
      } else {
        this.toast.errorToastr(res.message);
      }
    }, (err: any) => {
      this.toast.errorToastr("Something went wrong");
      this.gs.isSpinnerShow = false;
    })
  }

}
