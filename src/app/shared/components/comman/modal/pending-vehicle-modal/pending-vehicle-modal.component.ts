import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EmailQuoteDialogComponent } from '../../../dialoge/email-quote-dialog/email-quote-dialog.component';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-pending-vehicle-modal',
  standalone: true,
  imports: [
    CommonModule,
    // MatDialogModule,
  ],
  templateUrl: './pending-vehicle-modal.component.html',
  styleUrl: './pending-vehicle-modal.component.scss'
})
export class PendingVehicleModalComponent {

  @Input() title: string;
  @Input() confirmButton: string;
  @Input() cancelButton: string;
  @Input() totalVehicles!: number;
  @Input() completedVehicles!: number;

  get pendingVehicles(): number {
    return this.totalVehicles - this.completedVehicles;
  }

  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    // public dialogRef: MatDialogRef<InformationModalComponent>,
    // @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  closeModal() {
    this.modalService.dismissAll();
  }
  onConfirm() {
    this.activeModal.close({ confirmed: true });
  }

}
