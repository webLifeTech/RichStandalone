import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { GlobalService } from '../../../../../shared/services/global.service';

@Component({
  selector: 'app-driver-info-modal',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule
  ],
  providers: [
    NgbActiveModal,
  ],
  templateUrl: './driver-info-modal.component.html',
  styleUrl: './driver-info-modal.component.scss'
})
export class DriverInfoModalComponent {
  @Input() driverInfoData: any = {};
  @Input() groupedSectionsData: any = {};

  constructor(
    private modalService: NgbModal,
    public gs: GlobalService
  ) {
  }

  ngOnInit() {
  }

  closeModal() {
    this.modalService.dismissAll();
  }

}
