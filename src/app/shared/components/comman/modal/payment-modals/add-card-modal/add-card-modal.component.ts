import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-card-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './add-card-modal.component.html',
  styleUrl: './add-card-modal.component.scss'
})
export class AddCardModalComponent {

  @Input() title: string;
  @Input() singleDetails: any = {};
  @Input() isAdd: boolean;
  @Input() isEdit: boolean;
  reason: any = "";

  cardForm: any = {
    card_number: "",
    name_on_card: "",
    cvv: "",
    expiry_date: "",
    rememberme: false
  }

  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
  ) { }

  ngOnInit() {
    this.cardForm = this.singleDetails;
  }

  closeModal() {
    this.modalService.dismissAll();
  }
  onConfirm() {

    this.activeModal.close({ confirmed: true, reason: this.reason });
  }

}
