import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-change-phone-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './change-phone-modal.component.html',
  styleUrl: './change-phone-modal.component.scss'
})
export class ChangePhoneModalComponent {

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
