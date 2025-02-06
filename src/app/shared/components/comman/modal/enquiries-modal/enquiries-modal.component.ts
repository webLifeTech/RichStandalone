import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OtpVerificationModalComponent } from '../../../../../modules/user-dashboard/user-settings/modals/otp-verification-modal/otp-verification-modal.component';
import { VerificationSuccessModalComponent } from '../../../../../modules/user-dashboard/user-settings/modals/verification-success-modal/verification-success-modal.component';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-enquiries-modal',
  standalone: true,
  imports: [
    CommonModule,
    NgSelectModule,
    FormsModule
  ],
  templateUrl: './enquiries-modal.component.html',
  styleUrl: './enquiries-modal.component.scss'
})
export class EnquiriesModalComponent {
  @Input() title: string;
  @Input() singleDetails: any = {};
  @Input() filteredSubCategories: any = {};
  @Input() isAdd: boolean;
  @Input() isEdit: boolean;

  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
  ) { }

  ngOnInit() {
  }

  closeModal() {
    this.modalService.dismissAll();
  }
  onConfirm() {
    // this.activeModal.close({ confirmed: true });
    this.openOtpVerification();
  }

  openOtpVerification() {
    const modalRef = this.modalService.open(OtpVerificationModalComponent, {
      centered: true
    });
    modalRef.result.then((res: any) => {
      if (res.confirmed) {
        this.openVerificationSuccess();
      }
    }, () => {
    });
  }

  openVerificationSuccess() {
    const modalRef = this.modalService.open(VerificationSuccessModalComponent, {
      centered: true
    });
    modalRef.componentInstance.title = "Enquiry sent successfully.";
    modalRef.result.then((res: any) => {

    }, () => {
    });
  }
}
