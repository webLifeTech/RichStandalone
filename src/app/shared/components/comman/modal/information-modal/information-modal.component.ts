import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-information-modal',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './information-modal.component.html',
  styleUrl: './information-modal.component.scss'
})
export class InformationModalComponent {

  @Input() title: string;
  @Input() confirmButton: string;
  @Input() cancelButton: string;

  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
  ) { }

  closeModal() {
    this.modalService.dismissAll();
  }
  onConfirm() {

    this.activeModal.close({ confirmed: true });
  }

}
