import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AlertService } from '../../../../../shared/services/alert.service';
import { PaginationService } from '../../../../../shared/services/pagination.service';
import { ToastService } from '../../../../../shared/services/toast.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { PaymentOptionAddEditComponent } from '../payment-option-add-edit/payment-option-add-edit.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { NgxPaginationModule } from "ngx-pagination";
import { MatExpansionModule } from '@angular/material/expansion';
import { DeleteModalComponent } from '../../../../../shared/components/comman/modal/booking-modals/delete-modal/delete-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CardTypesComponent } from '../../../../../shared/components/comman/card-types/card-types.component';
import { MatIconModule } from '@angular/material/icon';
import { ViewPaymentInfoModalComponent } from '../../modal/view-payment-info-modal/view-payment-info-modal.component';

@Component({
  selector: 'app-payment-option-list',
  standalone: true,
  imports: [
    PaymentOptionAddEditComponent,
    CardTypesComponent,

    CommonModule,
    TranslateModule,
    FormsModule,
    MatMenuModule,
    MatButtonModule,
    NgxPaginationModule,
    MatExpansionModule,
    MatIconModule,
    NgSelectModule
  ],
  templateUrl: './payment-option-list.component.html',
  styleUrl: './payment-option-list.component.scss'
})

export class PaymentOptionListComponent {
  currentPage: number = 1; //
  pageSize: number = 1;
  totalRecord: any = 0;
  searchText: any;
  editIndex: any = 0;

  @Input() formType: any;
  editInfo: any = {}
  isAdd: boolean = false;

  menuForm: any = {
    menu_name: "",
    status: null,
    sub_menu_name: "",
    parent_menu: null,
    redirect_url: "",
    description: "",
  };

  statusList: any = [
    { name: 'Active', value: true },
    { name: 'Deactive', value: false },
  ];

  paymentOptions: any = [
    {
      "id": 1,
      "holder_name": "Abcd",
      "card_name": "SBI Credit Card",
      "card_type": "visa",
      "type": "credit_card",
      "last4": "2245",
      "card_number": "875987342245",
      "cvv": "123",
      "expiry_date": "22/30",
      "status": true,
      "description": "Its Paras user",
    },
    {
      "id": 3,
      "holder_name": "Abcd",
      "card_name": "Axis Credit Card",
      "card_type": "mastercard",
      "type": "credit_card",
      "last4": "4332",
      "card_number": "875987344332",
      "cvv": "123",
      "expiry_date": "22/30",
      "status": true,
      "description": "Its Lala user",
    },
  ];

  constructor(
    private toast: ToastService,
    private alert: AlertService,
    private paginationService: PaginationService,
    private modalService: NgbModal,
  ) {
  }

  ngOnInit() {
  }

  getUsers() {
  }

  onEdit(item: any, index: any) {
    this.editInfo = item;
    this.editIndex = index;
    this.isAdd = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async onView(item: any) {
    const modalRef = this.modalService.open(ViewPaymentInfoModalComponent, {
      size: 'lg'
    });
    modalRef.componentInstance.singleDetails = item;
    modalRef.result.then((res: any) => {
    }, () => {
    });
  }
  async onDelete(index: any) {
    const modalRef = this.modalService.open(DeleteModalComponent, {
      centered: true,
    });
    modalRef.result.then((res: any) => {
      if (res.confirmed) {
        this.paymentOptions.splice(index, 1);
        this.toast.successToastr("Deleted successfully");
      }
    }, () => { });
  }

  cancelAdd() {
    this.isAdd = false;
  }

  onSubmit(form: any) {
    if (form.type === "credit_card") {
      this.paymentOptions.unshift({
        id: 100,
        holder_name: form.credit_card.holder_name || "",
        card_name: form.credit_card.card_name || "Axis Credit Card",
        card_type: form.credit_card.card_type || "",
        last4: this.getMaskedCardNumber(form.credit_card.card_number) || "",
        card_number: form.credit_card.card_number || "",
        cvv: form.credit_card.cvv || "",
        expiry_date: form.credit_card.expiry_date || "",
        type: form.type || "",
      });
    }
    if (form.type === "banking") {
      this.paymentOptions.unshift({
        id: 100,
        routing_number: form.banking.routing_number || "",
        account_number: form.banking.account_number || "",
        bank_name: form.banking.bank_name || "",
        holder_name: form.banking.holder_name || "",
        last4: this.getMaskedCardNumber(form.banking.account_number) || "",
        type: form.type || "",
      });
    }
    if (form.type === "wallet") {
      this.paymentOptions.unshift({
        id: 100,
        holder_name: form.credit_card.holder_name || "",
        card_name: form.credit_card.card_name || "Axis Credit Card",
        card_type: form.credit_card.card_type || "",
        last4: this.getMaskedCardNumber(form.credit_card.card_number) || "",
        card_number: form.credit_card.card_number || "",
        cvv: form.credit_card.cvv || "",
        expiry_date: form.credit_card.expiry_date || "",
        type: form.type || "",
      });
    }
    this.toast.successToastr("User added successfully");
    this.isAdd = false;
    this.editInfo = {};
  }

  onUpdate(form: any) {
    if (form.type === "credit_card") {
      this.paymentOptions[this.editIndex].holder_name = form.credit_card.holder_name || "";
      this.paymentOptions[this.editIndex].card_name = form.credit_card.card_name || "Axis Credit Card";
      this.paymentOptions[this.editIndex].card_type = form.credit_card.card_type || "";
      this.paymentOptions[this.editIndex].last4 = this.getMaskedCardNumber(form.credit_card.card_number) || "";
      this.paymentOptions[this.editIndex].card_number = form.credit_card.card_number || "";
      this.paymentOptions[this.editIndex].cvv = form.credit_card.cvv || "";
      this.paymentOptions[this.editIndex].expiry_date = form.credit_card.expiry_date || "";
      this.paymentOptions[this.editIndex].type = form.type || "";
      // this.paymentOptions[this.editIndex] = {
      // };
    }

    if (form.type === "banking") {
      this.paymentOptions[this.editIndex].routing_number = form.banking.routing_number || "";
      this.paymentOptions[this.editIndex].account_number = form.banking.account_number || "";
      this.paymentOptions[this.editIndex].bank_name = form.banking.bank_name || "";
      this.paymentOptions[this.editIndex].holder_name = form.banking.holder_name || "";
      this.paymentOptions[this.editIndex].last4 = this.getMaskedCardNumber(form.banking.account_number) || "";
      this.paymentOptions[this.editIndex].type = form.type || "";
    }
    // this.paymentOptions[this.editIndex] = form;
    this.toast.successToastr("User updated successfully");
    this.isAdd = false;
    this.editInfo = {};
  }

  getMaskedCardNumber(fullCreditCardNumber: any): string {
    const length = fullCreditCardNumber.length;
    const last4Digits = fullCreditCardNumber.slice(length - 4);
    const maskedDigits = ''.repeat(length - 4);
    return maskedDigits + last4Digits;
  }

  pageChanged(event: any) {
    this.currentPage = event;
  }
}
