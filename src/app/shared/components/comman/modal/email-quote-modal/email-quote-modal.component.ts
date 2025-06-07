import { CommonModule } from '@angular/common';
import { Component, Inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../../../services/toast.service';
import { CabService } from '../../../../services/cab.service';
import { GlobalService } from '../../../../services/global.service';


@Component({
  selector: 'app-email-quote-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './email-quote-modal.component.html',
  styleUrl: './email-quote-modal.component.scss'
})
export class EmailQuoteModalComponent {

  email!: string;
  remarks: string;
  @Input() details: any = {};
  @Input() type: any;
  constructor(
    private modalService: NgbModal,
    private toast: ToastService,
    public cabService: CabService,
    public gs: GlobalService,
  ) { }

  ngOnInit() {
    console.log("details >>>>>>>>", this.details);

  }
  onClose(): void {
    this.modalService.dismissAll();
    // this.dialogRef.close();
  }

  submitEmail() {
    if (!this.remarks) {
      this.toast.errorToastr("Please enter an remark.");
      return
    }

    let body = {
      "userId": this.gs.loggedInUserInfo.userId,
      // "riskId": this.details.timeType,
      // "riskType": this.details.timeType,
      "riskId": this.type === 'car' ? this.details.vehicleId : this.details.driverId,
      "riskType": this.type === 'car' ? 'Vehicle' : 'Driver',
      "remarks": this.remarks
    }

    this.gs.isSpinnerShow = true;
    this.cabService.AddDriverOrVehicleEnquiry(body).subscribe((res: any) => {
      console.log("AddDriverOrVehicleEnquiry >>>>", res);
      if (res && res.statusCode == "200") {
        this.toast.successToastr("Enquiry sent successfully");
        this.modalService.dismissAll();
      }
      this.gs.isSpinnerShow = false;
    }, (err: any) => {
      this.gs.isSpinnerShow = false;
    })

  }
}
