import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GlobalService } from '../../../../../services/global.service';
import { BookingService } from '../../../../../services/booking.service';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { ProfileService } from '../../../../../services/profile.service';

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
  @Input() type: any = {};
  documentsList: any = [];

  constructor(
    private modalService: NgbModal,
    public gs: GlobalService,
    private bookingService: BookingService,
    private profileService: ProfileService,
  ) { }

  ngOnInit() {
    if (this.type == 'kycDocs') {
      this.getAllUserDocuments();
    } else {
      this.getAllBookingDocuments();
    }
  }

  getAllBookingDocuments() {
    const body = {
      "bookingId": this.bookingDetails.bookingId,
      "userId": this.gs.loggedInUserInfo.userId,
      "riskId": this.bookingDetails.riskId,
      "riskType": this.bookingDetails.riskType
    }

    this.gs.isSpinnerShow = true;
    this.bookingService.GetBookingAllDocuments(body).subscribe((res: any) => {
      console.log("GetBookingAllDocuments >>>>>", res);
      this.gs.isSpinnerShow = false;
      this.documentsList = res['bookingDocuments'];
    }, (error: any) => {
      this.gs.isSpinnerShow = false;
    });
  }

  getAllUserDocuments() {
    const body = {
      "loginUserId": this.gs.loggedInUserInfo.userId,
      "userId": this.bookingDetails.userId,
      "riskId": this.bookingDetails.riskId,
      "riskType": this.bookingDetails.riskType,
    }

    this.gs.isSpinnerShow = true;
    this.profileService.GetUserDocuments(body).subscribe((res: any) => {
      console.log("GetUserDocuments >>>>>", JSON.parse(res));
      this.gs.isSpinnerShow = false;
      this.documentsList = JSON.parse(res);
    }, (error: any) => {
      this.gs.isSpinnerShow = false;
    });
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  viewDoc(item: any) {

  }

  downloadDoc(documentId: any) {
    this.gs.isSpinnerShow = true;
    this.gs.DownloadDocs({
      "documentId": documentId,
    }).subscribe((res: any) => {
      this.gs.isSpinnerShow = false;
      this.gs.downloadBase64File(res.fileName, res.base64String, res.fileType);
    }, (error: any) => {
      this.gs.isSpinnerShow = false;
    });
  }

}
