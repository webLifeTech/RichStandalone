import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CreditCardFormatDirective, CreditCardValidators, CvcFormatDirective, ExpiryFormatDirective } from 'angular-cc-library';
import { GlobalService } from '../../../../services/global.service';


@Component({
  selector: 'app-booking-credit-card',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    CreditCardFormatDirective,
    ExpiryFormatDirective,
    CvcFormatDirective
  ],
  templateUrl: './booking-credit-card.component.html',
  styleUrls: ['./booking-credit-card.component.scss']
})
export class BookingCreditCardComponent {

  @Input() from: any;
  selectedMethod: any = "";
  paymentMethodForm: any = {};
  form: FormGroup;
  cardType: any = "";
  creditCards: any = {
    "visa": "assets/images/icon/visa.png",
    "unionpay": "assets/images/icon/unionpay.png",
    "mastercard": "assets/images/icon/master.png",
    "amex": "assets/images/icon/american-express.png",
    "discover": "assets/images/icon/discover.png",
    "jcb": "assets/images/icon/jcb.png",
    "dinersclub": "assets/images/icon/dinersclub.png",
    "maestro": "assets/images/icon/maestro.png",
    "dankort": "assets/images/icon/dankort.png",
  };

  constructor(
    private _fb: FormBuilder,
    private gs: GlobalService
  ) {
    this.form = this._fb.group({
      cardNumber: [''], // [CreditCardValidators.validateCCNumber]
      expirationDate: [''], // [CreditCardValidators.validateExpDate]
      cvc: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(4)]],
      holderName: ['']
    });
    this.gs.paymentDetails.creditCard = this.form;

    this.form.valueChanges.subscribe(() => {
      console.log("change -->", this.form.value);
      this.gs.paymentDetails.creditCard = this.form;
    });
  }

  onEnterCreditCard(event: any) {
    this.cardType = event.resolvedScheme$._value;
  }
  onSubmit(form: any) {
    console.log(form);


  }


}
