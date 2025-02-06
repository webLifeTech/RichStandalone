import { Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-verification-success-modal',
  standalone: true,
  imports: [],
  templateUrl: './verification-success-modal.component.html',
  styleUrl: './verification-success-modal.component.scss'
})
export class VerificationSuccessModalComponent {
  @Input() title: string;
  constructor(
    private modalService: NgbModal,
  ) {
  }

  closeModal() {
    this.modalService.dismissAll();
  }
}
