import { Component, EventEmitter, Input, Output } from '@angular/core';
import { cabPromoCode } from '../../../../../shared/components/data/data/filter/cab';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../../../shared/services/toast.service';
import { GlobalService } from '../../../../../shared/services/global.service';

@Component({
  selector: 'app-cab-promo-code',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule
  ],
  templateUrl: './cab-promo-code.component.html',
  styleUrl: './cab-promo-code.component.scss'
})
export class CabPromoCodeComponent {
  @Output() applyCoupon = new EventEmitter<any>();

  constructor(
    private toast: ToastService,
    public gs: GlobalService,
  ) { }

  applyCouponCode(item: any) {
    this.toast.successToastr("Coupon Applied!");
    this.applyCoupon.emit({ couponCode: item.couponCode });
  }

  removeCoupon(item: any) {
    item.checked = false;
    this.applyCoupon.emit({ couponCode: null });
  }

}
