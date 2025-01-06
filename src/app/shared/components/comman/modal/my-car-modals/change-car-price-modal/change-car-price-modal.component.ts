import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-change-car-price-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './change-car-price-modal.component.html',
  styleUrl: './change-car-price-modal.component.scss'
})
export class ChangeCarPriceModalComponent {

  @Input() title: string;
  @Input() singleDetails: any = {};
  @Input() isAdd: boolean;
  @Input() isEdit: boolean;

  form: any = {
    price_per_day: "",
    price_per_week: "",
    price_per_month: "",
  }

  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
  ) { }

  ngOnInit() {
    this.form.price_per_day = this.singleDetails.price_per_day;
    this.form.price_per_week = this.singleDetails.price_per_week;
    this.form.price_per_month = this.singleDetails.price_per_month;
  }

  closeModal() {
    this.modalService.dismissAll();
  }
  onConfirm() {

    this.activeModal.close({ confirmed: true, pricing: this.form });
  }

}
