import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-verification-success-modal',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './verification-success-modal.component.html',
  styleUrl: './verification-success-modal.component.scss'
})
export class VerificationSuccessModalComponent {
  @Input() title: string = "";
  @Input() buttonLabel: string = "";
  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
  ) {
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  onConfirm() {
    this.activeModal.close({ confirmed: true });
  }
}
