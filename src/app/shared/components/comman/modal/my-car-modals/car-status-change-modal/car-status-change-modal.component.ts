import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-car-status-change-modal',
  standalone: true,
  imports: [
    CommonModule,
    NgSelectModule,
    TranslateModule,
    FormsModule
  ],
  templateUrl: './car-status-change-modal.component.html',
  styleUrl: './car-status-change-modal.component.scss'
})
export class CarStatusChangeModalComponent {

  @Input() mainTitle: string;
  @Input() title: string;
  @Input() singleDetails: any = {};
  @Input() confirmButton: string;
  @Input() cancelButton: string;

  vehicleStatusList: any = [
    { id: 1, name: 'Active', value: 'Active' },
    { id: 2, name: 'Inactive', value: 'Inactive' },
    // { id: 3, name: 'Repair', value: 'Repair' },
  ]
  form: any = {
    status: "",
  }

  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
  ) { }

  ngOnInit() {
    this.form.status = this.singleDetails.status;
  }

  closeModal() {
    this.modalService.dismissAll();
  }
  onConfirm() {

    this.activeModal.close({ confirmed: true, status: this.form.status });
  }

}
