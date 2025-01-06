import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { GlobalService } from '../../../../../shared/services/global.service';

@Component({
  selector: 'app-dynamic-info-modal',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule
  ],
  providers: [
    NgbActiveModal,
  ],
  templateUrl: './dynamic-info-modal.component.html',
  styleUrl: './dynamic-info-modal.component.scss'
})
export class DynamicInfoModalComponent {
  @Input() driverInfoData: any = {};
  @Input() groupedSectionsData: any = {};

  constructor(
    private modalService: NgbModal,
    public gs: GlobalService
  ) {
  }

  ngOnInit() {
    console.log("1111111 driverInfoData >>>>>>>", this.driverInfoData);
  }

  closeModal() {
    this.modalService.dismissAll();
  }

}
