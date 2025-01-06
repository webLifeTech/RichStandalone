import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-payment-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './add-payment-modal.component.html',
  styleUrl: './add-payment-modal.component.scss'
})
export class AddPaymentModalComponent {

  @Input() title: string;
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
