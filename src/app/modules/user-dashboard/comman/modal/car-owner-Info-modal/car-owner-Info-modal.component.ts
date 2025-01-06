import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { GlobalService } from '../../../../../shared/services/global.service';

@Component({
  selector: 'app-car-owner-Info-modal',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule
  ],
  providers: [
    NgbActiveModal,
  ],
  templateUrl: './car-owner-Info-modal.component.html',
  styleUrl: './car-owner-Info-modal.component.scss'
})
export class CarOwnerInfoModalComponent {
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
