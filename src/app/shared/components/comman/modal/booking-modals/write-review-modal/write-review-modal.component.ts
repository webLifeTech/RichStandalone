import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BarRating } from 'ngx-bar-rating';

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
    review: ""
  };

  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
  ) { }

  ngOnInit() {
    if (this.singleDetails && this.singleDetails.id) {
      this.form.rating = this.singleDetails.rating;
      this.form.review = this.singleDetails.review;
    }
  }

  closeModal() {
    this.modalService.dismissAll();
  }
  onConfirm() {
    this.activeModal.close({ confirmed: true, form: this.form });
  }

}
