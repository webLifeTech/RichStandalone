import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CabInformationComponent } from '../../../../../modules/cab/booking/widgets/cab-information/cab-information.component';

@Component({
  selector: 'app-cancel-policy-modal',
  standalone: true,
  imports: [
    CommonModule,
    CabInformationComponent,
  ],
  templateUrl: './cancel-policy-modal.component.html',
  styleUrl: './cancel-policy-modal.component.scss'
})
export class CancelPolicyModalComponent {

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
