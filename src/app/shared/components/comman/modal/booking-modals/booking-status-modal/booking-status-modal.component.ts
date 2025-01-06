import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GlobalService } from '../../../../../services/global.service';
import { CurrencySymbolPipe } from '../../../../../pipe/currency.pipe';

@Component({
  selector: 'app-booking-status-modal',
  standalone: true,
  imports: [
    CommonModule,
    CurrencySymbolPipe
  ],
  providers: [
    NgbActiveModal,
  ],
  templateUrl: './booking-status-modal.component.html',
  styleUrl: './booking-status-modal.component.scss'
})
export class BookingStatusModalComponent {
  @Input() bookingDetails: any = "";

  constructor(
    private modalService: NgbModal,
    public gs: GlobalService,
  ) { }

  closeModal() {
    this.modalService.dismissAll();
  }

}
