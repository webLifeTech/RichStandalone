import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { GlobalService } from '../../../../../shared/services/global.service';
import { FormsModule } from '@angular/forms';
import { CardTypesComponent } from '../../../../../shared/components/comman/card-types/card-types.component';

@Component({
  selector: 'app-view-payment-info-modal',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    CardTypesComponent,
    FormsModule
  ],
  providers: [
    NgbActiveModal,
  ],
  templateUrl: './view-payment-info-modal.component.html',
  styleUrl: './view-payment-info-modal.component.scss'
})
export class ViewPaymentInfoModalComponent {
  @Input() singleDetails: any = {};

  constructor(
    private modalService: NgbModal,
    public gs: GlobalService
  ) {
  }

  closeModal() {
    this.modalService.dismissAll();
  }

}
