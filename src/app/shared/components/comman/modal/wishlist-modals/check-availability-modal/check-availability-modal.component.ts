import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ToastService } from '../../../../../services/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-check-availability-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    TranslateModule
  ],
  templateUrl: './check-availability-modal.component.html',
  styleUrl: './check-availability-modal.component.scss'
})
export class CheckAvailabilityModalComponent {

  @Input() title: string;
  @Input() type: string;
  @Input() singleDetails: any = {};
  @Input() isAdd: boolean;
  @Input() isEdit: boolean;
  reason: any = "";
  isAvailabilityForBook: boolean = false;

  cardForm: any = {
    card_number: "",
    name_on_card: "",
    cvv: "",
    expiry_date: "",
    rememberme: false
  }

  public searchObj: any = {
    pick_up_location: "",
    drop_location: "",
    same_location: "",
    pick_time: "",
    drop_time: "",
    type: "",
    location_type: "option2",
  };

  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private router: Router,
    private toast: ToastService,
  ) { }

  ngOnInit() {
    this.cardForm = this.singleDetails;
  }

  closeModal() {
    this.modalService.dismissAll();
  }
  onConfirm() {

    this.isAvailabilityForBook = true;

    this.toast.successToastr("Availability For Book");
    // this.activeModal.close({ confirmed: true, reason: this.reason });
  }

  bookNow() {
    this.closeModal();
    let params = {
      type: this.type || null,
    }
    this.router.navigate(['/cab/booking/booking', this.singleDetails.id], {
      queryParams: params,
      // queryParamsHandling: "merge"
    });
  }

}
