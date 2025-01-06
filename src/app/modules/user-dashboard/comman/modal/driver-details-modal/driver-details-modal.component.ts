import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { GlobalService } from '../../../../../shared/services/global.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-driver-details-modal',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule
  ],
  providers: [
    NgbActiveModal,
  ],
  templateUrl: './driver-details-modal.component.html',
  styleUrl: './driver-details-modal.component.scss'
})
export class DriverDetailsModalComponent {
  @Input() driverInfoData: any = {};

  constructor(
    private modalService: NgbModal,
    public gs: GlobalService
  ) {
  }

  closeModal() {
    this.modalService.dismissAll();
  }

}
