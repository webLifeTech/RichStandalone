import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GlobalService } from '../../../../../services/global.service';
import { CurrencySymbolPipe } from '../../../../../pipe/currency.pipe';

@Component({
  selector: 'app-booking-details-modal',
  standalone: true,
  imports: [
    CommonModule,
    CurrencySymbolPipe
  ],
  providers: [
    NgbActiveModal,
  ],
  templateUrl: './booking-details-modal.component.html',
  styleUrl: './booking-details-modal.component.scss'
})
export class BookingDetailsModalComponent {
  @Input() bookingDetails: any = "";

  constructor(
    private modalService: NgbModal,
    public gs: GlobalService,
  ) { }

  closeModal() {
    this.modalService.dismissAll();
  }

}
