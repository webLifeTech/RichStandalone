import { Component, Input } from '@angular/core';
import { CabService } from '../../../../../shared/services/cab.service';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { GlobalService } from '../../../../../shared/services/global.service';
import { CurrencySymbolPipe } from '../../../../../shared/pipe/currency.pipe';

@Component({
  selector: 'app-cab-information',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
    CurrencySymbolPipe,
  ],
  templateUrl: './cab-information.component.html',
  styleUrl: './cab-information.component.scss'
})
export class CabInformationComponent {
  @Input() singleItem: any = {};
  refundPolicy: any = [];
  constructor(
    public cabService: CabService,
    public gs: GlobalService,
  ) { }

  ngOnInit() {
  }

}
