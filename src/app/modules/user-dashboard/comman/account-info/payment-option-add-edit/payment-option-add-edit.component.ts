import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../../../../shared/services/toast.service';
import { walletDetails } from '../../../../../shared/components/data/data/booking';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-payment-option-add-edit',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    NgSelectModule
    // MatExpansionModule,
  ],
  templateUrl: './payment-option-add-edit.component.html',
  styleUrl: './payment-option-add-edit.component.scss'
})

export class PaymentOptionAddEditComponent {
  @Input() editInfo: any;
  @Input() isEditInfo: boolean = false;
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  @Output() onUpdateSubmit = new EventEmitter<any>();

  paymentMethodForm: any = {
    type: "credit_card",
    credit_card: {
      card_number: "",
      card_type: "",
      expiry_date: "",
      cvv: "",
      holder_name: "",
    },
    banking: {
      routing_number: "",
      account_number: "",
      bank_name: "",
      holder_name: "",
    },
    wallet: {

    },
  };

  cardTypeList: any = [
    { name: 'Visa', value: 'visa' },
    { name: 'MasterCard', value: 'mastercard' },
    { name: 'Discover', value: 'discover' },
    { name: 'American Express', value: 'americanexpress' },
  ];

  public walletDetails = walletDetails;
  roleList: any = [];
  statusList: any = [
    { name: 'Active', value: true },
    { name: 'Deactive', value: false },
  ];
  constructor(
    private modal: NgbModal,
    private toast: ToastService,
  ) {
  }

  ngOnInit() {
    if (this.editInfo.id) {
      this.isEditInfo = true;
      this.paymentMethodForm.type = this.editInfo.type;
      if (this.paymentMethodForm.type === 'credit_card') {
        this.paymentMethodForm.credit_card = this.editInfo || {};
      }
      if (this.paymentMethodForm.type === 'banking') {
        this.paymentMethodForm.banking.routing_number = this.editInfo.routing_number || "";
        this.paymentMethodForm.banking.account_number = this.editInfo.account_number || "";
        this.paymentMethodForm.banking.bank_name = this.editInfo.bank_name || "";
        this.paymentMethodForm.banking.holder_name = this.editInfo.holder_name || "";
      }
      if (this.paymentMethodForm.type === 'wallet') {
        this.paymentMethodForm.banking.wallet = this.editInfo.wallet || "";
      }
    }
  }

  onFromSubmit(form: any) {
    this.onSubmit.emit(this.paymentMethodForm);
  }

  onFromUpdate() {
    this.onUpdateSubmit.emit(this.paymentMethodForm);
  }

  cancel() {
    this.onCancel.emit(null)
  }
}
