import { Component } from '@angular/core';
import { cabPromoCode } from '../../../../../shared/components/data/data/filter/cab';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-cab-promo-code',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule
  ],
  templateUrl: './cab-promo-code.component.html',
  styleUrl: './cab-promo-code.component.scss'
})
export class CabPromoCodeComponent {

  public cabPromoCode = cabPromoCode;

  selectedCode = {};

  constructor() {

  }

  selectCode() {

  }

}
