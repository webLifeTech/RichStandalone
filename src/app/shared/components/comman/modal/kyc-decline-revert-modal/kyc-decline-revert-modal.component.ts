import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-kyc-decline-revert-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './kyc-decline-revert-modal.component.html',
  styleUrl: './kyc-decline-revert-modal.component.scss'
})
export class KycDeclineRevertModalComponent {

  @Input() title: string;
  @Input() mainTitle: string;
  reason: any = "";

  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
  ) { }

  closeModal() {
    this.modalService.dismissAll();
  }
  onConfirm() {
    if (!this.reason) {
      return;
    }
    this.activeModal.close({ confirmed: true, reason: this.reason });
  }

}
