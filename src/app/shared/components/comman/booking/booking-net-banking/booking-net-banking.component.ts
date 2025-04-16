import { Component, Input } from '@angular/core';
import { netBankingDetails } from '../../../data/data/booking';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { OnlynumberDirective } from '../../../../directives/number-only.directive';
import { GlobalService } from '../../../../services/global.service';

@Component({
  selector: 'app-booking-net-banking',
  standalone: true,
  imports: [
    OnlynumberDirective,
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './booking-net-banking.component.html',
  styleUrls: ['./booking-net-banking.component.scss']
})
export class BookingNetBankingComponent {
  @Input() from: any;
  selectedMethod: any = "";
  paymentMethodForm: any = {};
  public netBankingDetails = netBankingDetails;

  paymentOptions: any = [
    {
      "id": 1,
      "routing_number": "333333333333",
      "account_number": "8888888888",
      "bank_name": "SBI",
      "holder_name": "Paras",
      "last4": "8888",
      "type": "banking"
    }
  ];

  form: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private gs: GlobalService
  ) {
    this.form = this._fb.group({
      rountingNo: ['', [Validators.required]],
      accountNo: ['', [Validators.required]],
      bank: ['', [Validators.required]],
      accountName: ['', [Validators.required]],
      accountType: ['Checking', [Validators.required]],
      accountEntityType: ['abc', [Validators.required]],
    });

    this.gs.paymentDetails.ach = this.form;
    this.form.valueChanges.subscribe(() => {
      console.log("change -->", this.form.value);
      this.gs.paymentDetails.ach = this.form;
    });
  }
}
