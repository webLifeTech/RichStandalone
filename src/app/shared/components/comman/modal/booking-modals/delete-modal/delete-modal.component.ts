import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-delete-modal',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './delete-modal.component.html',
  styleUrl: './delete-modal.component.scss'
})
export class DeleteModalComponent {

  @Input() mainTitle: string;
  @Input() title: string;
  @Output() callBack = new EventEmitter<string>();

  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
  ) { }

  closeModal() {
    this.modalService.dismissAll();
  }
  onDelete() {

    this.activeModal.close({ confirmed: true });
  }

}
