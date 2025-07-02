import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GlobalService } from '../../../../../services/global.service';
import { BookingService } from '../../../../../services/booking.service';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-view-alldocuments-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
  ],
  providers: [
    NgbActiveModal,
  ],
  templateUrl: './view-alldocuments-modal.component.html',
  styleUrl: './view-alldocuments-modal.component.scss'
})
export class ViewAllDocumentsModalComponent {
  @Input() bookingDetails: any = {};
  documentsList: any = [];

  constructor(
    private modalService: NgbModal,
    public gs: GlobalService,
    private bookingService: BookingService,
  ) { }

  ngOnInit() {
    this.getAllDocuments();
  }

  getAllDocuments() {
    const body = {
      "bookingId": this.bookingDetails.bookingId,
      "userId": this.gs.loggedInUserInfo.userId, // "c5c9b193-64ec-46ae-b1a1-f646bc1e0933" // this.gs.loggedInUserInfo.userId
      "riskId": this.bookingDetails.riskId,
      "riskType": this.bookingDetails.riskType
    }

    this.gs.isSpinnerShow = true;
    this.bookingService.GetBookingAllDocuments(body).subscribe((res: any) => {
      console.log("GetBookingAllDocuments >>>>>", res);
      this.gs.isSpinnerShow = false;
      this.documentsList = res;
    });
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  viewDoc(item: any) {

  }
  downloadDoc(item: any) {

  }

}
