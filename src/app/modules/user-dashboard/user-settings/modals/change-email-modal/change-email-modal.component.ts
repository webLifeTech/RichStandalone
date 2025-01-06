import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-change-email-modal',
  standalone: true,
  imports: [],
  templateUrl: './change-email-modal.component.html',
  styleUrl: './change-email-modal.component.scss'
})
export class ChangeEmailModalComponent {
  @Input() title: string;
  @Input() singleDetails: any = {};
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
    this.activeModal.close({ confirmed: true });
  }
}
