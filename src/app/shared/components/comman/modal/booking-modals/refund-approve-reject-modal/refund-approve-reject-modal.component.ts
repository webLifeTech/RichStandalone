import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-refund-approve-reject-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './refund-approve-reject-modal.component.html',
  styleUrl: './refund-approve-reject-modal.component.scss'
})
export class RefundApproveRejectModalComponent {

  @Input() title: string;
  @Input() bookingDetails: string;
  reason: any = "";

  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
  ) { }

  closeModal() {
    this.modalService.dismissAll();
  }
  onConfirm() {

    this.activeModal.close({ confirmed: true, reason: this.reason });
  }

}
